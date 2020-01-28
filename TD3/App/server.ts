import * as express from "express";
import * as path from "path";
const app = express();

let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

io.on("connection", function (socket: any) {
    console.log('Un utilisateur est connecté');
    io.sockets.emit('Nouveau message', { message: "Bonjour !"});
    let currentUser = {
        'name' : '',
        'ssn' : ''
    };

    socket.on('deconnexion', function(){
        console.log('Utilisateur déconnecté');
    });
});

const server = http.listen(3000, function() {
    console.log("Listening on *:3000");
});