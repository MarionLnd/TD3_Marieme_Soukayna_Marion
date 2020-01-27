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
io.on("connect", function (socket) {
    console.log('Un utilisateur est connecté');
    var currentUser = {
        'name': '',
        'ssn': ''
    };
    socket.on('message', function (message) {
        console.log(message);
        console.log("Le message");
        io.emit('cool', message);
    });
    socket.on('disconnect', function () {
        console.log('Utilisateur déconnecté');
    });
});
var server = http.listen(3000, function () {
    console.log("Listening on *:3000");
});