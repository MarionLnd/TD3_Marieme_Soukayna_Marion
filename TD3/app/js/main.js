$(function () {
    var socket = io();
    let counter = 0;

    socket.on('connect', function() {
        $('#messages').append($('<li>').text("Bonjour !"));
        $('#messages').append($('<li>').text("Veuillez entrer votre nom et prénom :"));
    });

    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        counter++;

        if(counter === 1) {
            socket.emit('firstMessage', $('#m').val());
        }
        if(counter === 2) {
            socket.emit('secondMessage', $('#m').val());
        }

        socket.emit('message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('firstMessage', function (msg) {
        $('#messages').append($('<li>').text("Vous vous appelez " + msg));
    });

    socket.on('message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('cool', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('hi', function(msg){
        $('#messages').append($('<li>').text("bienvenue"));
    });
});