import * as express from "express";
import * as path from "path";
const app = express();
let http = require("http").Server(app), io = require("socket.io")(http), validation = require('../ssn/ssnValidator.js'),
    infos = require('../ssn/informationFinder.js');

// questions to display in chatbox
const connections = [];
let data = new Map();
data.set(0, 'Please enter your lastname');
data.set(1, ' Please enter your SSN');

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
        // First message received
        dataMap.set('firstname', message);
        // echo the received message back down the
        io.sockets.emit('new message', { message: ' ** ' + message });

        if (cpt != 4) {
            io.sockets.emit('new message', { message: data.get(cpt) });
        }
        console.log('Message send  :', { message: data.get(cpt) }, ' cpt = ', cpt);
        if (cpt == 1) {
            dataMap.set('lastname', message);
            //cpt++;
        }

        if (cpt == 2) {
            dataMap.set('ssn', message);
            try {
                if(validation.isValid(message)) {
                    dataMap.set("Genre", infos.extractSex(message));
                    dataMap.set("Naissance", infos.extractBirthDate(message));
                    if(infos.extractBirthPlace(message) === '99') {
                        dataMap.set("Departement", "Etranger");
                    } else {
                        dataMap.set("Departement", infos.extractBirthPlace(message));
                    }
                    dataMap.set("Pays", infos.extractPays(message));
                }
            } catch (e) {
                console.log(e);
            }
            //cpt++;
        }

        if(cpt == 3) {
            console.log("test")
        }
        cpt++;
        console.log(dataMap);
    });
});
const server = http.listen(3000, function() {
    console.log("Listening on *:3000");
});