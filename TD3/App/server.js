"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var http = require("http").Server(app), io = require("socket.io")(http), validation = require('../ssn/ssnValidator.js'), infos = require('../ssn/informationFinder.js');
var creation = require('../App/models/person.js');
//§§§§§§§§§§§§§
//§§§§§§§§§§§§§§
// questions to display in chatbox
var connections = [];
var data = new Map();
data.set(0, "Veuillez entrer votre prénom");
data.set(1, 'Veuillez entrer votre nom de famille:');
data.set(2, ' Veuillez entrer votre numéro de sécurité sociale (SSN):');
data.set(3, ' Affichage des informations:');
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
        if (cpt == 0) {
            dataMap.set('sauvegarde', message);
        }
        // First message received
        if (cpt == 1) {
            dataMap.set('firstname', message);
        }
        // echo the received message back down the
        io.sockets.emit('new message', { message: ' ** ' + message });
        if (cpt != 4) {
            io.sockets.emit('new message', { message: data.get(cpt) });
        }
        console.log('Message send  :', { message: data.get(cpt) }, ' cpt = ', cpt);
        if (cpt == 2) {
            dataMap.set('lastname', message);
        }
        if (cpt == 3) {
            dataMap.set('ssn', message);
            try {
                if (validation.isValid(message)) {
                    dataMap.set("Genre", infos.extractSex(message));
                    dataMap.set("Naissance", infos.extractBirthDate(message));
                    if (infos.extractBirthPlace(message) === '99') {
                        dataMap.set("Departement", "Etranger");
                    }
                    else {
                        dataMap.set("Departement", infos.extractBirthPlace(message));
                    }
                    dataMap.set("Pays", infos.extractPays(message));
                    dataMap.forEach(function (value, key) {
                        io.sockets.emit('messageAffichage', { message: key + " : " + value, key: key, value: value });
                    });
                    if (dataMap.get("sauvegarde").toLowerCase() === "oui") {
                        console.log(mapToJson(dataMap));
                    }
                }
                else {
                    io.sockets.emit('new message', { message: "Votre SSN n'est pas valide. Veuillez rentrer une valeur valide" });
                    cpt = 1;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        /*if(cpt == 3) {
            console.log("test")
            io.sockets.emit('new message', { message: dataMap.get("Naissance") });
        }*/
        cpt++;
        console.log(dataMap);
    });
});
var server = http.listen(3000, function () {
    console.log("Listening on *:3000");
});
function strMapToObj(strMap) {
    var obj = Object.create(null);
    for (var _i = 0, strMap_1 = strMap; _i < strMap_1.length; _i++) {
        var _a = strMap_1[_i], k = _a[0], v = _a[1];
        obj[k] = v;
    }
    return obj;
}
function mapToJson(map) {
    return JSON.stringify(__spreadArrays(map));
}
