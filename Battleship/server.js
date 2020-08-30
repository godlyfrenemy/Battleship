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

var Maps = new Map();

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true
}));

// load html 
app.get('/', function (request, response) {
    response.render("index");
});

app.get('/CreateGame', function (request, response) {
    var rand = Math.floor(Math.random() * 10000).toString();
    if (!Maps.has(rand)) {
        Maps.set(rand, new GameMap());
    }
    response.redirect('/game/' + rand);
});

app.get('/game/:id', function (request, response) {
    var rand = request.params.id;
    if (Maps.has(rand)) {
        response.render("index2");
    } else {
        response.redirect('/');
    }
});

// POST GetSessionId
app.post('/GetSessionId', function (request, response) {
    response.json(request.session.id);
});

// socket connect 
io.on('connection', (socket) => {
    console.log("New user connected: ");

    socket.on('StartGame', (data) => {
        var Map = Maps.get(data.idGame);
        Map.PlayersRoom.forEach(function (value, key, map) {
            socket.emit('DisplayOnStart', { Name: value, Type: 'Players' });
        });
        Map.ObserversRoom.forEach(function (value, key, map) {
            socket.emit('DisplayOnStart', { Name: value, Type: 'Observers' });
        });
    });

    socket.on('AddRequest', (data) => {
        var Map = Maps.get(data.idGame);
        if (Map.AddUser(data.UserID, data.name)) {
            io.sockets.emit('AddResponse', { Name: data.name, Full: Map.playersFull });
        }
    })
});

class GameMap {
    constructor() {
        this.PlayersRoom = new Map();
        this.PlayersRoom.set('jasdlkfjlndlvjlkase', 'vitaliy');
        this.ObserversRoom = new Map();
        this.playersFull = false;
    }

    AddUser(UserID, name) {
        if (this.PlayersRoom.has(UserID) || this.ObserversRoom.has(UserID)) {
            return false;
        }
        else if (!this.playersFull) {
            this.PlayersRoom.set(UserID, name);
            if (this.PlayersRoom.size == 2)
                this.playersFull = true;
            return true;
        }
        else {
            this.ObserversRoom.set(UserID, name);
            return true;
        }
    }

}