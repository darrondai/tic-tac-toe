// MAKE USE OF FACTORIES AND CLOSURES
// making objects for each entity can help with display logic
// needs a game controller, players, gameboard
// SINGLE
// THERE MAY BE MULTIPLE GAMES (states)

// gameboard is obj with a 3x3 array, some state of the game aka markings, needs a way to mark a cell
// multiple gameboards may be made (make a new game)
const createGameboard = function (rowCount, colCount) {
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
  // MAY NEED LOGIC TO AVOID OVERWRITING
  const markCell = (x, y, mark) => {
    board_state[x][y] = mark;
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
  let board = createGameboard(3, 3);
  const player1 = createPlayer(player1Name, "X");
  const player2 = createPlayer(player2Name, "O");

  // state variable for active player, along with toggle func
  let activePlayer = player1;
  const getActivePlayer = () => activePlayer;
  const toggleActivePlayer = () =>
    activePlayer === player1 ? player2 : player1;
  // func for check win
  const checkWin = function () {};
  // func for playing a turn (check win at the end of each turn)
  const playRound = function () {
    // round logic
    // check win at end of turn
    if (checkWin()) {
      // change state????
      console.log("game over");
    }
  };
  // func for new game
  const startNewGame = function () {
    board = createGameboard();
  };
  // func for printing the game board
  const printGameboard = function () {
    board.printBoard();
  };

  return {
    getActivePlayer,
    toggleActivePlayer,
    playRound,
    startNewGame,
    printGameboard,
  };
})();
