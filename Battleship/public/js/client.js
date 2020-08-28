$(function () {
    var socket = io();
    var IdUser;
    if (!IdUser) StartGame();

    $('input').click(function (event) {
        socket.emit('AddRequest', { UserType: event.target.id, UserID: IdUser });
    })

    socket.on('AddResponse', (data) => {
        var text = '<div class = "info"> ID: ' + data.UserID + '</div>';
        if (data.UserType == 'playersConnect') {
            $('#players').append(text);
        }
        else {
            $('#observers').append(text);
        }
    });

    socket.on('DisplayOnStart', (data) => {
        for (var i = 0; i < data.Rooms.length; i++) {
            for (var j = 0; j < data.Rooms[i].length; j++) {
                if (!data.Rooms[i][j])
                    break;
                else {
                    var text = '<div class = "info"> ID: ' + data.Rooms[i][j] + '</div>';
                    if (!i) {
                        $('#players').append(text);
                    }
                    else {
                        $('#observers').append(text);
                    }
                }
            }
        }
    });

    function StartGame() {
        let request = new XMLHttpRequest();
        request.open("POST", "/GetSessionId", true);
        request.setRequestHeader("Content-Type", "application/json");
        setTimeout(request.addEventListener("load", function () {
            IdUser = JSON.parse(request.response);
            socket.emit('StartGame');
        }), 5000);
        request.send();
    }
});
