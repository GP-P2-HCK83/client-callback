import { SnakeIcon, LadderIcon } from "../GameIcons.jsx";
// import "./Game.css";

function Game({
  gameStatus,
  players,
  currentPlayer,
  diceValue,
  winner,
  isRolling,
  yourPlayerId,
  playerName, // Your player name
  playerNames, // All player names from server
  gameBoard,
  gameDifficulty,
  onRollDice,
  onResetGame,
  onBackToMenu,
}) {
  // Default/fallback snakes and ladders positions
  const defaultSnakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  };

  const defaultLadders = {
    1: 38,
    4: 14,
    9: 21,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  // Get current board (dynamic if available, fallback to default)
  const currentSnakes = gameBoard?.snakes || defaultSnakes;
  const currentLadders = gameBoard?.ladders || defaultLadders;

  // Function to generate random border color
  const getRandomBorderColor = () => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
      "#10ac84",
      "#ee5a52",
      "#0abde3",
      "#3867d6",
      "#8854d0",
      "#a55eea",
      "#26de81",
      "#fd79a8",
      "#fdcb6e",
      "#6c5ce7",
      "#74b9ff",
      "#00b894",
      "#e84393",
      "#f39c12",
      "#9b59b6",
      "#e17055",
      "#81ecec",
      "#fab1a0",
      "#00cec9",
      "#6c5ce7",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderBoard = () => {
    const board = [];

    for (let row = 9; row >= 0; row--) {
      const boardRow = [];
      const isEvenRow = row % 2 === 0;

      for (let col = 0; col < 10; col++) {
        const cellNumber = isEvenRow
          ? row * 10 + col + 1
          : row * 10 + (9 - col) + 1;

        let cellClass = "cell";
        let cellContent = cellNumber;

        // Generate random border color for each cell
        const randomBorderColor = getRandomBorderColor();

        // Get player positions
        const playersOnCell = Object.values(players).filter(
          (player) => player.position === cellNumber
        );

        if (playersOnCell.length > 1) {
          cellClass += " both-players";
          cellContent = "Both";
        } else if (playersOnCell.length === 1) {
          const player = playersOnCell[0];
          cellClass += ` player${player.playerNumber}`;
          cellContent = `P${player.playerNumber}`;
        }

        // Check for snakes and ladders
        if (currentSnakes[cellNumber]) {
          cellClass += " snake";
        } else if (currentLadders[cellNumber]) {
          cellClass += " ladder";
        }

        boardRow.push(
          <div
            key={cellNumber}
            className={cellClass}
            style={{
              border: `3px solid ${randomBorderColor}`,
              boxShadow: `0 0 8px ${randomBorderColor}30, inset 0 0 15px ${randomBorderColor}20`,
            }}
          >
            <span className="cell-number">{cellNumber}</span>
            <span className="cell-content">
              {cellContent !== cellNumber ? cellContent : ""}
            </span>
            {currentSnakes[cellNumber] && (
              <>
                <SnakeIcon size={50} className="game-icon snake-icon" />
                <span className="special destination">
                  →{currentSnakes[cellNumber]}
                </span>
              </>
            )}
            {currentLadders[cellNumber] && (
              <>
                <LadderIcon size={50} className="game-icon ladder-icon" />
                <span className="special destination">
                  →{currentLadders[cellNumber]}
                </span>
              </>
            )}
          </div>
        );
      }

      board.push(
        <div key={row} className="board-row">
          {boardRow}
        </div>
      );
    }

    return board;
  };

  // Alternative approach if server doesn't send player names
  const getPlayerInfo = (playerId) => {
    const player = players[playerId];
    if (!player) return null;

    // Get the display name for this player
    let displayName;
    if (yourPlayerId === playerId) {
      // For current user, use the name they entered
      displayName = playerName || `Player ${player.playerNumber}`;
    } else {
      // For other players, check if we have their name from server data
      displayName = playerNames?.[playerId] || 
                    player.name || // Check if player object has name property
                    `Opponent`; // Fallback to "Opponent"
    }

    return (
      <div
        className={`player ${currentPlayer === playerId ? "active" : ""} ${
          yourPlayerId === playerId ? "your-player" : ""
        }`}
      >
        <span>
          {displayName}{" "}
          {yourPlayerId === playerId ? "(You)" : ""}
        </span>
        <span>Position: {player.position}</span>
      </div>
    );
  };

  // Waiting Screen
  if (gameStatus === "waiting") {
    return (
      <div className="game-container">
        <h1>🐍 Callback Climb 🪜</h1>
        <div className="waiting-container">
          <div className="waiting-message">
            <div className="spinner"></div>
            <h2>Hello {playerName}! Waiting for an opponent...</h2>
            <p>You'll be matched automatically when another player joins!</p>
          </div>
          <button onClick={onBackToMenu} className="back-button">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="game-container">
      <h1>🐍 Callback Climb 🪜</h1>
      <div className="game-info">
        <div className="player-info">
          {Object.keys(players).map((playerId) => getPlayerInfo(playerId))}
        </div>
        <div className="board-info">
          <div className="difficulty-display">
            <span className="difficulty-label">Difficulty:</span>
            <span className={`difficulty-value ${gameDifficulty}`}>
              {gameDifficulty.charAt(0).toUpperCase() + gameDifficulty.slice(1)}
            </span>
          </div>
          {gameBoard && (
            <div className="board-stats">
              <span className="stat">
                🪜 {Object.keys(currentLadders).length} Ladders
              </span>
              <span className="stat">
                🐍 {Object.keys(currentSnakes).length} Snakes
              </span>
            </div>
          )}
        </div>
        <div className="dice-section">
          <div className={`dice ${isRolling ? "rolling" : ""}`}>
            {diceValue}
          </div>
          <button
            onClick={onRollDice}
            disabled={
              gameStatus === "won" ||
              isRolling ||
              currentPlayer !== yourPlayerId
            }
            className="roll-button"
          >
            {isRolling
              ? "Rolling..."
              : currentPlayer === yourPlayerId
              ? "Roll Dice"
              : "Opponent's Turn"}
          </button>
        </div>
      </div>
      {gameStatus === "won" && (
        <div className="winner-announcement">
          🎉{" "}
          {players[winner] && yourPlayerId === winner
            ? "You Win!"
            : "Opponent Wins!"}{" "}
          🎉
          <button onClick={onResetGame} className="reset-button">
            Play Again
          </button>
          <button onClick={onBackToMenu} className="menu-button">
            Back to Menu
          </button>
        </div>
      )}
      <div className="board">{renderBoard()}</div>
      <div className="game-controls">
        <button onClick={onBackToMenu} className="leave-button">
          Leave Game
        </button>
      </div>
      <div className="game-rules">
        <h3>🎮 Enhanced Game Rules:</h3>
        <ul>
          <li>
            🎯 <strong>Difficulty Levels:</strong> Choose Easy (12🪜,5🐍),
            Moderate (8🪜,8🐍), or Hard (5🪜,12🐍)
          </li>
          <li>
            🤖 <strong>AI Boards:</strong> Each game features a unique
            AI-generated board layout
          </li>
          <li>
            🐍 <strong>Snakes:</strong> Will take you down to lower positions
          </li>
          <li>
            🪜 <strong>Ladders:</strong> Will help you climb up faster
          </li>
          <li>
            🎲 <strong>Extra Turn:</strong> Roll a 6 to get another turn!
          </li>
          <li>
            💥 <strong>Send Back:</strong> Land on another player to send them
            back to position 1!
          </li>
          <li>
            🔄 <strong>Bounce Back:</strong> Going past 100 bounces you back
            (e.g., 98 + 5 = 97)
          </li>
          <li>
            🏆 <strong>Victory:</strong> First player to reach exactly 100 wins!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Game;