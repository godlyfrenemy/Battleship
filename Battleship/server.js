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
app.get('/', function (req, res) {
    res.render("index");
});

// POST GetSessionId
app.post('/GetSessionId', function (req, res) {
    res.json(req.session.id);
});

// socket connect 
io.on('connection', (socket) => {
    console.log("New user connected: ");

    socket.on('StartGame', (data) => {
        if (!Maps)
            Maps = new GameMap();
        Maps.AddUser(data);
        io.sockets.emit('display', Maps);
    });
});

class GameMap {
    constructor() {
        this.Rooms = new Array(2);
        this.Rooms[0] = new Array(2); //players
        this.Rooms[1] = new Array(5); //observers
        this.playersFull = false;
    }
    AddUser(UserID) {
        for (var i = 0; i < this.Rooms.length; i++) {
            for (var j = 0; j < this.Rooms[i].length; j++) {
                if (this.Rooms[i][j] == UserID)
                    return;
                else if (!this.Rooms[i][j]) {
                    this.Rooms[i][j] = UserID;
                    if (i == 0 && j == 1)
                        this.playersFull = true;
                    return;
                }
            }
        }
        this.Rooms[1].push(UserID);
    }
}