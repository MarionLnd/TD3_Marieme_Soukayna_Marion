import * as express from "express";
import * as path from "path";
const app = express();

let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

io.on("connect", function (socket: any) {
    console.log('Un utilisateur est connecté');
    let currentUser = {
        'name' : '',
        'ssn' : ''
    };

    socket.on('message', function(message){
        console.log(message);
        console.log("Le message");
        io.emit('cool', message);
    });

    socket.on('disconnect', function(){
        console.log('Utilisateur déconnecté');
    });
});

const server = http.listen(3000, function() {
    console.log("Listening on *:3000");
});