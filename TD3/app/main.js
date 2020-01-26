$(function () {
    var socket = io();
    let counter = 0;

    socket.on('connect', function() {
        $('#messages').append($('<li>').text("Bonjour et bienvenue !"));
        $('#messages').append($('<li>').text("Quel est votre nom ?"));
    });

    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        counter++;

        console.log("dans submit");
        console.log(counter);

        if(counter === 1) {
            console.log("counter 1 dans submit");
            socket.emit('firstMessage', $('#m').val());
        }
        if(counter === 2) {
            console.log("counter 2 dans submit");
            socket.emit('secondMessage', $('#m').val());
        }

        socket.emit('message', $('#m').val());
        $('#m').val('');
        //return false;
    });

    socket.on('firstMessage', function (msg) {
        console.log("event firstMessage in client");
        $('#messages').append($('<li>').text("Vous vous appelez " + msg));
    });

    socket.on('message', function (msg) {
        console.log("event message in client");
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('cool', function(msg){
        console.log("event cool in client");
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('hi', function(msg){
        console.log("event hi in client");
        $('#messages').append($('<li>').text("bienvenue"));
    });
});