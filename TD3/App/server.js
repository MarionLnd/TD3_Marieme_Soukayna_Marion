"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var http = require("http").Server(app), io = require("socket.io")(http), validation = require('../ssn/ssnValidator.js'), infos = require('../ssn/informationFinder.js');
// questions to display in chatbox
var connections = [];
var data = new Map();
data.set(0, ' enter your firstname');
data.set(1, ' enter your lastname');
data.set(2, ' enter your SSN');
var cpt = 0;
var dataMap = new Map();
var serverResponse = '';
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//log that user was connected  on port 3000 via web socket
io.on("connection", function (socket) {
    console.log('a user connected f');
    var currentUser = {
        'name': '',
        'ssn': ''
    };
    socket.on('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
    });
    // get received msg
    socket.on('sending message', function (message) {
        console.log('Message is received :', message);
        // echo the received message back down the
        io.sockets.emit('new message', { message: ' ** ' + message });
        if (cpt != 3) {
            io.sockets.emit('new message', { message: data.get(cpt) });
        }
        console.log('Message send  :', { message: data.get(cpt) }, ' cpt = ', cpt);
        console.log("Avant" + cpt);
        console.log("Apres" + cpt);
        if (cpt == 1) {
            dataMap.set('firstname', message);
            //cpt++;
        }
        if (cpt == 2) {
            dataMap.set('lastname', message);
            //cpt++;
        }
        if (cpt == 3) {
            dataMap.set('ssn', message);
            try {
                console.log(validation.isValid(message));
                if (validation.isValid(message)) {
                    console.log(infos.getInfo(message));
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        cpt++;
    });
});
var server = http.listen(3000, function () {
    console.log("Listening on *:3000");
});
