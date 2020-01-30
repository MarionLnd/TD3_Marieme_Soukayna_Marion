/*import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";*/
var express = require('express');
var path = require('path');
var ssnvalidator = require('./ssn/ssn_validator.js');
var informationFinder = require('./ssn/information_finder');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var request = require('request');
// questions to display in chatbox
var connections = [];
var data = new Map();
data.set(0, ' enter your firstname');
data.set(1, ' enter your lastname');
data.set(2, ' enter your SSN');
var cpt = 0;
var dataMap = new Map();
var information = new Map();
var serverResponse = '';
var ssn;
//log that user was connected  on port 3000 via web socket
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log(' %s sockets is connected', connections.length);
    io.sockets.emit('hello', { message: 'welcom' });
    io.sockets.emit('new message', { message: data.get(cpt) });
    socket.on('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
    });
    // get received msg
    socket.on('sending message', function (message) {
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
            dataMap.set('ssn', message);
            //  asyncCall();
            if (ssnvalidator.isValid(message)) {
                dataMap.set("Genre", informationFinder.extractSex(message));
                dataMap.set("Naissance", informationFinder.extractBirthDate(message));
                if (informationFinder.extractBirthPlace(message) === '99') {
                    dataMap.set("Departement", "Etranger");
                }
                else {
                    dataMap.set("Departement", informationFinder.extractBirthPlace(message));
                }
                dataMap.set("Pays", informationFinder.extractPays(message));
            }
            cpt = 0;
            console.log("**********" + dataMap);
        }
    });
});
function asyncCall() {
    var postData = {
        firstname: dataMap.get('firstname'),
        lastname: dataMap.get('lastname'),
        ssn: dataMap.get('ssn')
    };
}
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
var chat = http.listen(3000, function () {
    console.log("Listening on *:3000");
});
