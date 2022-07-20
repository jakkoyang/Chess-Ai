game = new Chess();
var socket = io();

var theme = "wikipedia";
if(localStorage.getItem("theme"))
  theme = localStorage.getItem("theme");

var color = "white";
var players;
var roomId;
var play = true;

var room = document.getElementById("room");
var roomNumber = document.getElementById("roomNumbers");
var button = document.getElementById("button");
var ai = document.getElementById("ai");
var aiLabel = document.getElementById("nawfal");
var custom = document.getElementById("custom");
var customLabel = document.getElementById("customize");
var state = document.getElementById('state');
var forfeit = document.getElementById('forfeit');
var undo = document.getElementById('undo');
var oppName = document.getElementById('oppName');
var lineBreak1 = document.getElementById('lineBreak1');
var lineBreak2 = document.getElementById('lineBreak2');

var connect = function(){
  roomId = room.value;
  if (roomId !== "" && parseInt(roomId) <= 100 && sessionStorage.getItem("pass") != null) {
    forfeit.style.display = "inline";
    undo.style.display = "inline";
    room.remove();
    roomNumber.innerHTML = "Room Number " + roomId;
    button.remove();
    ai.remove();
    lineBreak1.remove();
    lineBreak2.remove();
    aiLabel.remove();
    custom.remove();
    customLabel.remove();
    socket.emit('joined', roomId);
  }
}

socket.on('full', function (msg) {
  if(roomId == msg)
    alert("the room is full");
    $("body").load("room.html");
});

socket.on('play', function (msg) {
  if (msg == roomId) {
    play = false;
    state.innerHTML = "Game in progress"
  }
});

socket.on('gameOver', function (msg) {
  if (msg == roomId) {
    state.innerHTML = 'GAME OVER';
    forfeit.innerHTML = 'leave';
    changeElo(true)
    undo.style.display = "none";
  }
});

socket.on('move', function (msg) {
  if (msg.room == roomId) {
    game.move(msg.move);
    board.position(game.fen());
  }
});

socket.on('undo', function(msg) {
  if (msg == roomId) {
    game.undo()
    board.position(game.fen());
  }

})

socket.on('startUndo', function(msg) {
  if (msg == roomId) {
    if (confirm('Your opponent asked to undo. Accept?')) {
      undoPiece()
    }
  }
})

socket.on('getElo', function(oppElo, win, msg) {
  if (msg == roomId) {
    socket.emit('updateElo',sessionStorage.getItem("user"), sessionStorage.getItem("pass"),sessionStorage.getItem("elo"), oppElo, win, roomId);
  }
})

socket.on('eloUpdate', function(newElo) {
  sessionStorage.setItem("elo", newElo);
  document.getElementById("elo").innerHTML = "ELO: " + sessionStorage.getItem("elo") + "";
})

var removeGreySquares = function () {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true)
    background = '#696969';

  squareEl.css('background', background);
};

var onDragStart = function (source, piece) {

  if (game.game_over() === true || play ||
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
    (game.turn() === 'w' && color === 'black') ||
    (game.turn() === 'b' && color === 'white') ) {
      return false;
  }

};

function forfeitGame() {
  //forfeit code will go here
  location.reload()
}

function undoPiece() {
  game.undo()
  board.position(game.fen());
  socket.emit('undo', roomId);
}

function startPieceUndo() {
  socket.emit('startUndo', roomId);
}

function changeElo(win) {
  socket.emit('changeElo', sessionStorage.getItem("elo"), win, roomId);
}



var onDrop = function (source, target) {
  removeGreySquares();

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });
  if (game.game_over()) {
    state.innerHTML = 'GAME OVER'
    forfeit.innerHTML = 'leave'
    changeElo(false)
    socket.emit('gameOver', roomId);
    undo.style.display = "none";
  }

  if (move === null) return 'snapback';
  else
    socket.emit('move', { move: move, board: game.fen(), room: roomId });

};

var onMouseoverSquare = function (square, piece) {
    
  var moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function (square, piece) {
  removeGreySquares();
};

var onSnapEnd = function () {
  board.position(game.fen());
};


socket.on('player', (msg) => {
  var plno = document.getElementById('player');
  color = msg.color;

  plno.innerHTML = 'Player ' + msg.players + " : " + color;
  players = msg.players;
  plno.style.paddingTop = "6px";
  plno.style.verticalAlign = "center";

  if(players == 2){
    play = false;
    socket.emit('play', msg.roomId);
    state.innerHTML = "Game in Progress"
  }
  else
    state.innerHTML = "Waiting for Second player";

  var cfg = {
    orientation: color,
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    pieceTheme: `img/chesspieces/${theme}/{piece}.png`,
  };
  board = ChessBoard('board', cfg);
  $(window).resize(board.resize);
});

var board;
