// MAKE USE OF FACTORIES AND CLOSURES
// making objects for each entity can help with display logic
// needs a game controller, players, gameboard
// SINGLE
// THERE MAY BE MULTIPLE GAMES (states)

// gameboard is obj with a 3x3 array, some state of the game aka markings, needs a way to mark a cell
// multiple gameboards may be made (make a new game)
const createGameboard = function () {
  // row and col count are both 3
  const ROW_COUNT = 3;
  const COL_COUNT = 3;

  // private board_state (no setter, but have a getter for win checks etc)
  // initialize with empty cells noted by empty string ""
  const board_state = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    let row = [];
    for (let j = 0; j < COL_COUNT; j++) {
      row.push("");
    }
    board_state.push(row);
  }

  // function to view board_state
  const getBoard = () => board_state;
  // function to print board state (for the console)
  const printBoard = () => {
    for (let row of board_state) {
      console.log(row);
    }
  };

  // function to mark a cell given an i, j, and a mark
  // MAY NEED LOGIC TO AVOID OVERWRITING / out of bounds
  const markCell = (x, y, mark) => {
    // handle out of bounds
    if (x < 0 || y < 0 || x >= ROW_COUNT || y >= COL_COUNT) {
      console.log("Pick a cell within 3x3 bounds!");
      return false;
    }
    // avoid overwriting
    if (board_state[x][y] != "") {
      console.log(`Cell ${x},${y} already marked! Pick a different cell`);
      return false;
    }
    board_state[x][y] = mark;
    return true;
  };

  return { getBoard, printBoard, markCell };
};

// each player has a name, score, and mark
const createPlayer = function (name, mark) {
  // private name w/ a getter
  const getName = () => name;
  // private score with get/increment
  let score = 0;
  const getScore = () => score;
  const incrementScore = () => score++;
  // private mark w/ a getter (for marking a cell)
  const getMark = () => mark;

  return { getName, getScore, incrementScore, getMark };
};

// singleton game controller
// funcs for: win check, playing a round/turn, restarting the game
// state includes whos turn?
// input player names
const gameController = (function (
  player1Name = "player1",
  player2Name = "player2"
) {
  // create gameboard and player instances
  let board = createGameboard();
  const player1 = createPlayer(player1Name, "X");
  const player2 = createPlayer(player2Name, "O");

  // TODO???? state variable for finished game
  let isGameOver = false;
  const getGameOverStatus = () => isGameOver;

  // need to call board.getBoard() instead of just passing board.getBoard func
  // bc only passing the function will use the wrong lexical context
  // same with printboard
  const getBoard = () => board.getBoard();
  const printBoard = () => board.printBoard();

  // func for new game
  const startNewGame = function () {
    isGameOver = false;
    board = createGameboard();
  };

  // state variable for active player, along with toggle func
  let activePlayer = player1;
  const getActivePlayer = () => activePlayer;
  const toggleActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  // func for check win
  const checkWin = function () {
    // check rows, cols and diagonals
    let boardState = board.getBoard();

    const activeMark = activePlayer.getMark();
    // rows
    if (
      boardState[0][0] == activeMark &&
      boardState[0][1] == activeMark &&
      boardState[0][2] == activeMark
    ) {
      return true;
    }
    if (
      boardState[1][0] == activeMark &&
      boardState[1][1] == activeMark &&
      boardState[1][2] == activeMark
    ) {
      return true;
    }
    if (
      boardState[2][0] == activeMark &&
      boardState[2][1] == activeMark &&
      boardState[2][2] == activeMark
    ) {
      return true;
    }
    // cols
    if (
      boardState[0][0] == activeMark &&
      boardState[1][0] == activeMark &&
      boardState[2][0] == activeMark
    ) {
      return true;
    }
    if (
      boardState[0][1] == activeMark &&
      boardState[1][1] == activeMark &&
      boardState[2][1] == activeMark
    ) {
      return true;
    }
    if (
      boardState[0][2] == activeMark &&
      boardState[1][2] == activeMark &&
      boardState[2][2] == activeMark
    ) {
      return true;
    }
    // diagonals
    if (
      boardState[0][0] == activeMark &&
      boardState[1][1] == activeMark &&
      boardState[2][2] == activeMark
    ) {
      return true;
    }
    if (
      boardState[2][0] == activeMark &&
      boardState[1][1] == activeMark &&
      boardState[0][2] == activeMark
    ) {
      return true;
    }

    // no 3 in a row means no win
    return false;
  };

  // func for stalemates when board is full
  const checkBoardFull = () => !board.getBoard().flat().includes("");

  // func for printing the game board
  const printGameState = function () {
    board.printBoard();
    console.log(`${activePlayer.getName()}'s Move:`);
  };

  // func for playing a turn (check win at the end of each turn)
  const playRound = function (row, col) {
    // round logic
    // pick a cell to mark with the current player's mark (early return if invalid move)
    let validMove = board.markCell(row, col, activePlayer.getMark());
    if (!validMove) {
      return;
    }
    // board.printBoard();
    printGameState();
    // check win at end of turn
    if (checkWin()) {
      // print board after marking IF winning move
      isGameOver = true;
      board.printBoard();
      console.log(`Game Over! ${activePlayer.getName()} wins!!!`);
      return;
    }
    // TODO: add logic for stalemate!!!
    else if (checkBoardFull()) {
      isGameOver = true;
      console.log("Stalemate! Try again.");
      return;
    }
    // swap active player for next turn
    toggleActivePlayer();
  };

  return {
    getBoard,
    printBoard,
    getActivePlayer,
    playRound,
    startNewGame,
    getGameOverStatus,
    checkBoardFull,
  };
})();

// screenController will handle the view
// inject the gameController
const screenController = (function (game) {
  // get the DOM elements?
  const alertMsgView = document.querySelector(".alert-message");
  const legendView = document.querySelector(".player-legend");
  const boardView = document.querySelector(".board");
  const newGameBtn = document.querySelector(".new-game-btn");

  // TODO: add legend to display, no need to reload
  // const p1 = document.createElement("p");
  // p1.textContent = game.getActivePlayer().getName();
  // legendView.appendChild(p1);
  // TODO: add player name inputs
  // TODO: add alertmsg displaying (will need to return strings instead of console.print)

  // func to update the display
  function updateScreen() {
    // clear board view
    boardView.textContent = "";

    // get most recent board state and active player
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // render the board (each cell is a button)
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // create cell btn
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell");
        cellBtn.textContent = cell;
        // add row and col index to dataset of btn element
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = colIndex;
        boardView.appendChild(cellBtn);
      });
    });

    // inert toggle when game is over
    if (game.getGameOverStatus()) {
      boardView.toggleAttribute("inert");
    }
  }

  // func to handle clicks
  // have to make sure the target is a button
  function boardClickHandler(event) {
    // early return if click wasn't on a cell
    if (!event.target.classList.contains("cell")) {
      return;
    }

    const selectedRow = event.target.dataset.row;
    const selectedCol = event.target.dataset.col;
    game.playRound(selectedRow, selectedCol);

    // updateScreen after the round is played
    updateScreen();
  }

  // driver code!!!!
  // attach click handler for entire board,
  boardView.addEventListener("click", boardClickHandler);
  // attach click handler for new game btn
  newGameBtn.addEventListener("click", (event) => {
    // inert toggle, have to make sure that it only happens when the previous game was over/stalemate
    if (game.getGameOverStatus()) {
      boardView.toggleAttribute("inert");
    }
    // start new game, then update screen
    game.startNewGame();
    updateScreen();
  });
  // initial render
  updateScreen();
})(gameController);
