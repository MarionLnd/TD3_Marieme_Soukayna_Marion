import * as express from "express";
import * as path from "path";
const app = express();

let http = require("http").Server(app);
let io = require("socket.io")(http);

// questions to display in chatbox
const connections = [];
let data = new Map();
data.set(0, ' enter your firstname');
data.set(1, ' enter your lastname');
data.set(2, ' enter your SSN');
let cpt = 0;

let dataMap = new Map();
let serverResponse = '';

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

//log that user was connected  on port 3000 via web socket
io.on("connection", function (socket: any) {
    console.log('a user connected f');
    let currentUser = {
        'name' : '',
        'ssn' : ''
    };
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
    });

    // get received msg
    socket.on('sending message', (message) => {
        console.log('Message is received :', message);
        // echo the received message back down the
        io.sockets.emit('new message', { message: ' ** ' + message });
        cpt++;
        if (cpt != 3) {
            io.sockets.emit('new message', { message: data.get(cpt) });
        }
        console.log('Message send  :', { message: data.get(cpt) }, ' cpt = ', cpt);

        if (cpt == 1) {
            dataMap.set('firstname', message);
        }

        if (cpt == 2) {
            dataMap.set('lastname', message);
        }

        if (cpt == 3) {
            if (message == 0)
            {
                console.log("Tu as mis un 0");
            }
            dataMap.set('ssn', message);
            cpt = 0;
        }
    });
});
const server = http.listen(3000, function() {
    console.log("Listening on *:3000");
});