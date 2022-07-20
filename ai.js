var theme = "wikipedia";
if(localStorage.getItem("theme"))
  theme = localStorage.getItem("theme");

const cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare,
  pieceTheme: `img/chesspieces/${theme}/{piece}.png`,
}

game = new Chess();
const $searchDepth = $('#searchDepth');
const gameEval = document.getElementById("eval");

const pawnEvalWhite =
  [
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [ 5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
    [ 1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
    [ 0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
    [ 0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
    [ 0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
    [ 0.5,  1.0,  1.0, -2.0, -2.0,  1.0,  1.0,  0.5],
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
  ];

const pawnEvalBlack = reverseArray(pawnEvalWhite);

const knightEval =
  [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
    [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
    [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
    [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
    [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
    [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
  ];

const bishopEvalWhite =
  [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
  ];

const bishopEvalBlack = reverseArray(bishopEvalWhite);

const rookEvalWhite =
  [
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [ 0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ 0.0,  0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
  ];

const rookEvalBlack = reverseArray(rookEvalWhite);

const queenEval =
  [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ 0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
  ];

const kingEvalWhite =
  [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [ 2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [ 2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
  ];

const kingEvalBlack = reverseArray(kingEvalWhite);

function reverseArray(array) {
  return array.slice().reverse();
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) {
    return false;
  }
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  setTimeout(makeBestMove, 250);
}

function makeBestMove() {
  if (game.game_over()) {
    alert('Game over');
  }

  const depth = +$searchDepth.prop('value');

  const bestMove = minimaxRoot(game, depth, true);
  game.move(bestMove);
  board.position(game.fen());
  gameEval.innerHTML = `<strong>Evaluation (Centipawns):</strong> ${evaluateBoard(game.board())}`;
  
  if (game.game_over()) {
    alert('Game over');
  }
}

function onMouseoverSquare(square, piece) {
  const moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (const move of moves) {
    greySquare(move.to);
  }
}

function onMouseoutSquare() {
  removeGreySquares();
}

function onSnapEnd() {
  board.position(game.fen());
  gameEval.innerHTML = `<strong>Evaluation (Centipawns):</strong> ${evaluateBoard(game.board())}`;
}

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '');
}

function greySquare(square) {
  const $square = $(`#myBoard .square-${square}`);

  let background = '#a9a9a9';
  if ($square.hasClass('black-3c85d')) {
    background = '#696969';
  }

  $square.css('background', background);
}

function minimax(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  const moves = game.moves();

  if (maximizingPlayer) {
    let bestMove = -Infinity;
    for (const move of moves) {
      game.move(move);
      const value = minimax(game, depth-1, alpha, beta, false);
      bestMove = Math.max(bestMove, value);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        game.undo();
        break;
      }
      game.undo();
    }
    return bestMove;
  } else {
    let bestMove = +Infinity;
    for (const move of moves) {
      game.move(move);
      const value = minimax(game, depth-1, alpha, beta, true);
      bestMove = Math.min(bestMove, value);
      beta = Math.min(beta, value);
      if (alpha >= beta) {
        game.undo();
        break;
      }
      game.undo();
    }
    return bestMove;
  }
  
}

function minimaxRoot(game, depth, maximizingPlayer) {
  const moves = game.moves();
  let bestMove = -Infinity;
  let bestMoveFound = null;

  for (const move of moves) {
    game.move(move);
    const value = minimax(game, depth-1, -Infinity, Infinity, !maximizingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = move;
    }
  }

  return bestMoveFound;
}

function evaluateBoard(board) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (piece === null) {
    return 0;
  }
  let absoluteValue;
  if (piece.type === 'p') {
    absoluteValue = 100 + (piece.color ? pawnEvalWhite[x][y] : pawnEvalBlack[x][y]);
  } else if (piece.type === 'n') {
    absoluteValue = 300 + knightEval[x][y];
  } else if (piece.type === 'b') {
    absoluteValue = 300 + (piece.color ? bishopEvalWhite[x][y] : bishopEvalBlack[x][y]);
  } else if (piece.type === 'r') {
    absoluteValue = 500 + (piece.color ? rookEvalWhite[x][y] : rookEvalBlack[x][y]);
  } else if (piece.type === 'q') {
    absoluteValue = 900 + queenEval[x][y];
  } else if (piece.type === 'k') {
    absoluteValue = 9000 + (piece.color ? kingEvalWhite[x][y] : kingEvalBlack[x][y]);
  } else {
    throw Error(`Unknown piece type: ${piece.type}`);
  }

  return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

board = ChessBoard('aiBoard', cfg);
$(window).resize(board.resize);