const path 		= require('path'),
    rootPath 	= path.normalize(__dirname + '/..');

let default_config = module.exports 	= {

    /**
     * DEFAULT CONFIG : API
     */

    // ---- name
    name : "API REST",

    // ---- Version
    version : '1.0.0',

    port			: process.env.PORT || 3011,

    // ---- Database configuration
    db	: {
        link      : "mongodb://localhost/demo",
        options : {
            promiseLibrary: require('bluebird'),
            useNewUrlParser: true
        }
    },


    // ---- Params Allowed Origins by environment
    allowedOrigins : [ 'localhost:*', '0.0.0.0:*','128.0.0.150:*'],

    // ---- Default URL
    url : 'http://127.0.0.1:3011',

    rootPath : rootPath+"/app"
};

module.exports = default_config;