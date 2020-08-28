$(function () {

    var socket = io();
    var IdUser;
    var urlSplit = window.location.href.split('/');
    var idGame = urlSplit[urlSplit.length - 1];
    if (!IdUser) StartGame();

    $('#button').click(function (event) {
        if ($("#name").val() == '') {
            return;
        }
        else {
            var name = $("#name").val();
            socket.emit('AddRequest', { UserID: IdUser, name: name, idGame: idGame });
        }
    })

    socket.on('AddResponse', (data) => {
        
    });

    socket.on('DisplayOnStart', (data) => {
       
    });

    function StartGame() {
        let request = new XMLHttpRequest();
        request.open("POST", "/GetSessionId", true);
        request.setRequestHeader("Content-Type", "application/json");
        setTimeout(request.addEventListener("load", function () {
            IdUser = JSON.parse(request.response);
            socket.emit('StartGame', { idGame: idGame });
        }), 5000);
        request.send();
    }
});
