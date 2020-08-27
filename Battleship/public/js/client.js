$(function () {
    var socket = io();
    var IdUser;
    if (!IdUser) StartGame();

    socket.on('display', (data) => {
        $('#players').html(null);
        $('#observers').html(null);
        var players = data.Rooms[0];
        var observers = data.Rooms[1];
        for (var i = 0; i < players.length; i++) {
            if (players[i]) {
                var text = '<div class = "info"> Index: ' + (i + 1) + ', ID: ' + players[i] + '</div>';
                $('#players').append(text);
            }
        }
        for (var i = 0; i < observers.length; i++) {
            if (observers[i]) {
                var text = '<div class = "info"> Index: ' + (i + 1) + ', ID: ' + observers[i] + '</div>';
                $('#observers').append(text);
            }
        }
       
    });

    function StartGame() {
        let request = new XMLHttpRequest();
        request.open("POST", "/GetSessionId", true);
        request.setRequestHeader("Content-Type", "application/json");
        setTimeout(request.addEventListener("load", function () {
            IdUser = JSON.parse(request.response);
            socket.emit('StartGame', IdUser);
        }), 5000);
        request.send();
    }
});