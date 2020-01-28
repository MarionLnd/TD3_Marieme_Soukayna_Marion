/*import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";*/
const express = require('express');
const path = require('path');

const app = express();

let http = require("http").Server(app);
let io = require("socket.io")(http);
const  request = require('request');



// questions to display in chatbox
const connections = [];
let data = new Map();
data.set(0, ' enter your firstname');
data.set(1, ' enter your lastname');
data.set(2, ' enter your SSN');
let cpt = 0;

let dataMap = new Map();
let serverResponse = '';

//log that user was connected  on port 3000 via web socket
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(' %s sockets is connected', connections.length);
    io.sockets.emit('new message', { message: data.get(cpt) });


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
            dataMap.set('ssn', message);
            asyncCall();
            cpt = 0;
        }

    });
});


function asyncCall() {
    let postData = {
        firstname: dataMap.get('firstname'),
        lastname: dataMap.get('lastname'),
        ssn: dataMap.get('ssn')
    };



    const clientServerOptions = {
        uri: 'http://localhost:3011/people/',
        body: postData,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true // Automatically stringifies the body to JSON

    };

    request(clientServerOptions, function (error, response, body) {
        if (error != null) {
            console.log('error:', error);
        }
        else {

            serverResponse = body;
            console.log('statusCode:',
                response && response.statusCode, 'BODY ', serverResponse);

            io.sockets.emit('new message', {
                message:
                    JSON.stringify(serverResponse)
            });


        }

    });



}

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname,'index.html'))
});
const server = http.listen(3000, function() {
    console.log("Listening on *:3000");

});