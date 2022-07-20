const express = require('express');
const http = require('http');
const socket = require('socket.io');
const Database = require('@replit/database');
const bcrypt = require('bcrypt');

const db = new Database();
const port = process.env.PORT || 8080;
console.log(process.env.REPLIT_DB_URL)
var app = express();
const server = http.createServer(app);
const io = socket(server);
const saltRounds = 10;
var players;
var joined = true;
var loggedIn = [];

app.use(express.static(__dirname + '/'));

var games = Array(100);
for (let i = 0; i < 100; i++) {
	games[i] = { players: 0, pid: [0, 0] };
}

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/room.html');
	res.sendFile(__dirname + '/ai.html');
	res.sendFile(__dirname + '/custom.html');
});

io.on('connection', function(socket) {
	var color;
	var playerId = Math.floor(Math.random() * 100 + 1);

	socket.on('joined', function(roomId) {
		if (games[roomId].players < 2) {
			games[roomId].players++;
			games[roomId].pid[games[roomId].players - 1] = playerId;
		} else {
			socket.emit('full', roomId);
			return;
		}

		players = games[roomId].players;

		if (players % 2 == 0) color = 'black';
		else color = 'white';

		socket.emit('player', { playerId, players, color, roomId });
	});

	socket.on('move', function(msg) {
		socket.broadcast.emit('move', msg);
	});

	socket.on('play', function(msg) {
		socket.broadcast.emit('play', msg);
	});

	socket.on('undo', function(msg) {
		socket.broadcast.emit('undo', msg);
	});

	socket.on('startUndo', function(msg) {
		socket.broadcast.emit('startUndo', msg);
	});

	socket.on('gameOver', function(msg) {
		socket.broadcast.emit('gameOver', msg);
	});

	socket.on('disconnect', function() {
		loggedIn[loggedIn[socket.id]] = false;
		for (let i = 0; i < 100; i++) {
			if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
				games[i].players--;
		}
	});

	socket.on('checkLogin', function(user, pass) {
		db.get(user)
			.then(value => {
				if (loggedIn[user])
					socket.emit('alert', "you're already signed in somewhere");
				else if (bcrypt.compareSync(pass, value[0])) {
					socket.emit('checkLogin', user, value[0], value[1]);
					loggedIn[user] = true;
					loggedIn[socket.id] = user;
				} else socket.emit('alert', 'your username or password is incorrect');
			})
			.catch(err => {
				socket.emit('alert', 'your username or password is incorrect');
			});
	});

	socket.on('signUp', function(user, pass) {
		db.get(user).then(value => {
			if (value == null) {
				bcrypt.hash(pass, saltRounds, function(err, hash) {
					db.set(user, [hash, 1200]).then(() => {
						socket.emit('alert', 'signup sucessful');
					});
				});
			} else socket.emit('alert', 'that username is taken');
		});
	});

	socket.on('changeElo', function(elo, win, msg) {
		socket.broadcast.emit('getElo', elo, win, msg);
	});

	socket.on('updateElo', function(user, pass, elo, oppElo, win) {
		elo = calculateElo(Number(elo), Number(oppElo), 30, Number(win));
		db.get(user)
			.then(value => {
				if (pass == value[0]) {
					db.set(user, [pass, elo]);
					socket.emit('eloUpdate', elo);
				} else socket.emit('alert', "you aren't logged in");
			})
			.catch(err => {
				socket.emit('alert', 'error');
			});
	});
});

function calculateElo(ra, rb, k, win) {
	let e = 1 / (1 + Math.pow(10, (rb - ra) / 100));
	return (ra + k * (win - e)).toFixed(0);
}

server.listen(port);
console.log('Connected');
