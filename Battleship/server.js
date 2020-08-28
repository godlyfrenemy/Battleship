var app = require('express')();
var http = require('http').createServer(app);
const session = require('express-session');
//app.use(expressStatusMonitor({ websocket: io, port: app.get('port') })); 
http.listen(3000, () => console.log("Server is running"));
var io = require('socket.io')(http);
var express = require('express');
var $ = require("jquery");

app.set("view engine", "hbs");

app.use(express.static('public'));

var Maps;

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true
}));

// load html 
app.get('/', function (request, response) {
    response.render("index");
});

// POST GetSessionId
app.post('/GetSessionId', function (request, response) {
    response.json(request.session.id);
});

// socket connect 
io.on('connection', (socket) => {
    console.log("New user connected: ");

    socket.on('StartGame', () => {
        if (!Maps)
            Maps = new GameMap();
        else {
            socket.emit('DisplayOnStart', Maps);
        }
    });

    socket.on('AddRequest', (data) => {
        if (Maps.AddUser(data.UserID, data.UserType)) {
            io.sockets.emit('AddResponse', { UserType: data.UserType, UserID: data.UserID });
        }
    })
});

class GameMap {
    constructor() {
        this.Rooms = new Array(2);
        this.Rooms[0] = new Array(2); //players
        this.Rooms[1] = new Array(5); //observers
        this.playersFull = false;
    }
    AddUser(UserID, UserType) {
        if (UserType == 'playersConnect' && !this.playersFull) {
            if (!this.CanAddUser(UserID)) 
                return false;
            var players = this.Rooms[0];
            for (var i = 0; i < players.length; i++) 
                if (!players[i]) {
                    players[i] = UserID;
                    if (i == players.length - 1)
                        this.playersFull = true;
                    return true;
                }
        }
        else if (UserType == 'playersConnect' && this.playersFull) {
            return false;
        }
        else {
            if (this.CanAddUser(UserID)) {
                var observers = this.Rooms[1];
                observers.push(UserID);
                return true;
            }
            else {
                return false;
            }
        }
    }

    CanAddUser(UserID) {
        for (var i = 0; i < this.Rooms.length; i++) {
            for (var j = 0; j < this.Rooms[i].length; j++) {
                if (this.Rooms[i][j] == UserID)
                    return false;
            }
        }
        return true;
    }
}