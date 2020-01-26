"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
io.on("connection", function (socket) {
    console.log('a user connected f');
    var currentUser = {
        'name': '',
        'ssn': ''
    };
    socket.on('message', function (message) {
        console.log(message);
        console.log("event message in server");
        io.emit('cool', message);
    });
    socket.on('firstMessage', function (message) {
        currentUser.name = message;
        console.log(currentUser);
        console.log("event FirstMessage in server");
        io.emit('secondMessage', message);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
var server = http.listen(3000, function () {
    console.log("Listening on *:3000");
});
