// --- INIT DEPENDENCIES
let express     = require('express'),
    cluster     = require('cluster'),
    fs          = require('fs'),
    async       = require('async'),
    cpu         = 2, //require('os').cpus().length,
    Util        = require('./app/helpers/appUtils');

// ---- CONFIG
var config = require('./config/config');
global.config = config; //-- Create a global variable to stock all config information
if(cluster.isMaster )
{
    // === MASTER === //
    global.pid = 'M';
    Util.info('CLUSTER: Master process started.');

    // Spawn Workers
    let workerTimeouts = [];

    for (let i=0; i < cpu; i++){
        cluster.fork();
    }

    // Add worker message listeners
    Object.keys(cluster.workers).forEach(function(id)
    {
        cluster.workers[id].on('message', workerMessage);
    });

    // Wait 5 seconds for worker to start up before checking
    cluster.on('fork', function(worker)
    {
        workerTimeouts[worker.id] = setTimeout(clusterError, 5000);
    });

    cluster.on('listening', function(worker, address)
    {
        Util.info('CLUSTER: Worker is now connected to ' + config.url + ':' + address.port);
        clearTimeout(workerTimeouts[worker.id]);
    });

    cluster.on('exit', function(worker, code, signal)
    {
        var message = 'CLUSTER: Worker ' + worker.id + ' exited (code=' + code + ' sig=' + signal +' suicide=' + worker.suicide + ')';
        Util.error(message);
        clearTimeout(workerTimeouts[worker.id]);

        if ( !worker.suicide )
        {
            Util.info('CLUSTER: Respawning Worker...');
            cluster.fork();
        }
    });

    function clusterError()
    {
        Util.error('CLUSTER: Worker did not start. Something must be wrong.');
    }

    function workerMessage(msgObj)
    {
        if ( msgObj.cmd == 'SHUTDOWN' )
        {
            // Remote Shutdown - Kill Workers
            Util.info('CLUSTER: Shutting down...');

            Object.keys(cluster.workers).forEach(function(id)
            {
                cluster.workers[id].kill();
            });
        }
        else
        {
            Util.error('CLUSTER: Worker Message - cmd=' + msgObj.cmd + ' INVALID COMMAND');
        }
    }
}else{

    // ----- Set the Process Id global
    global.pid = cluster.worker.id;

    // ----- Log
    Util.info('Preparing Worker Thread ' + global.pid);

    //  ----- Database connection
    let mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    let database = mongoose.connect(config.db.link,config.db.options);

    //  ----- Express settings
    let app = express();
    require('./config/express')(app,database);
    let router = express.Router();

    // ----- Function to load all local dependencies
    var loadModel = function(path) {
        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath);
                }
            } else if (stat.isDirectory()) {
                loadModel(newPath);
            }
        });
    };

    var loadRouter = function(path) {
        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                try{
                    if (/(.*)\.(js$|coffee$)/.test(file)) {
                        try{
                            require(newPath)(router);
                        }catch(ex){
                            Util.error("Invalid router file "+file,ex);
                        }
                    }
                }catch(err){
                    throw err
                }
            }
        });
    };

    // ----- Process to load modules from each models and routes available
    var modules = ['people']; // --- Modules to load

    async.forEach(modules,function(module,moduleLoaded){

        // --- Params access path
        var path_models = __dirname + '/app/'+module+'/models/',
            path_routes = __dirname + '/app/'+module+'/routes/';

        // --- Load Model and Route
        loadModel(path_models);
        setTimeout(function(){
            loadRouter(path_routes);
        },0)
        // ----  End treatment
        moduleLoaded()

    },function(){
        Util.info('Load all models ' + global.pid);
    });

    /**
     * Manage errors
     */
    process.on('uncaughtException', function(err)
    {
        Util.error('Caught exception: ' + err,err.stack,'system');
        console.log(err);
        // var stack = new Error().stack
        // Util.error(err.stack);

        // Really need to gracefully disconnect and kill the worker here
        // Use Domains structure
        process.exit(1);
    });


    // ---- Add all routes to the application
    app.use('/',router);

    // Manage 404 Route
    app.use(function(req, res) {
        // Error page
        // add a log error with the headers
        Util.error("Invalid route ask "+req.originalUrl,req.headers,'invalid route');
        res.sendStatus(406);
    });

    // var httpsServer = https.createServer(credentials, app);

    app.listen(config.port, function(){
        Util.info('Starting Worker Thread ' + global.pid);
    });

    // Expose app
    exports = module.exports = app;
}