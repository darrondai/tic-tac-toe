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

  // func for printing the game board
  const printGameState = function () {
    board.printBoard();
    console.log(`${activePlayer.getName()}'s Move:`);
  };

  // func for playing a turn (check win at the end of each turn)
  const playRound = function (row, col) {
    printGameState();
    // round logic
    // // print the board
    // board.printBoard();
    // pick a cell to mark with the current player's mark
    board.markCell(row, col, activePlayer.getMark());
    // print board after marking
    board.printBoard();
    // check win at end of turn
    if (checkWin()) {
      // change state????
      console.log(`Game Over! ${activePlayer.getName()} wins!!!`);
      return;
    }
    // swap active player for next turn
    toggleActivePlayer();
  };

  // func for new game
  const startNewGame = function () {
    board = createGameboard();
  };

  return {
    getActivePlayer,
    playRound,
    startNewGame,
  };
})();

gameController.playRound(0, 0);
gameController.playRound(0, 1);
gameController.playRound(1, 1);
gameController.playRound(1, 2);
gameController.playRound(2, 2);
