import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SnakeIcon, LadderIcon } from "./GameIcons.jsx";
import "./App.css";

function App() {
  // Socket and connection states
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameStatus, setGameStatus] = useState("menu"); // 'menu', 'waiting', 'playing', 'won'
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("moderate");

  // Game states
  const [players, setPlayers] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [diceValue, setDiceValue] = useState(1);
  const [winner, setWinner] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [yourPlayerId, setYourPlayerId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [gameBoard, setGameBoard] = useState(null); // Dynamic board from AI
  const [gameDifficulty, setGameDifficulty] = useState("moderate");

  // Default/fallback snakes and ladders positions (used if no dynamic board)
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

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("https://api.stevenong.site");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setConnectionStatus("Connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    });

    newSocket.on("waiting-for-opponent", () => {
      setGameStatus("waiting");
      setConnectionStatus("Waiting for opponent...");
    });
    newSocket.on("game-started", (data) => {
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setYourPlayerId(data.yourPlayerId);
      setGameStatus("playing");
      setConnectionStatus("Game in progress");

      // Set dynamic board if provided
      if (data.board) {
        setGameBoard(data.board);
        setGameDifficulty(data.difficulty || "moderate");

        // Show notification about board type
        if (data.board.isAIGenerated === false) {
          setTimeout(() => {
            alert(
              "AI board generation failed. Using a preset board for this game."
            );
          }, 1000);
        }
      }
    });
    newSocket.on("game-update", (data) => {
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setDiceValue(data.diceValue);

      if (data.gameStatus === "won") {
        setGameStatus("won");
        setWinner(data.winner);
      }

      // Handle special game events
      if (data.lastMove) {
        const { extraTurn, diceValue } = data.lastMove;

        // Show message for rolling 6
        if (extraTurn && diceValue === 6) {
          setTimeout(() => {
            alert("You rolled a 6! You get another turn!");
          }, 500);
        }
      }

      // Show message for players sent back to position 1
      if (data.playersAffected && data.playersAffected.length > 0) {
        data.playersAffected.forEach((playerId) => {
          const affectedPlayer = data.players[playerId];
          if (affectedPlayer) {
            setTimeout(() => {
              alert(
                `Player ${affectedPlayer.playerNumber} was sent back to position 1!`
              );
            }, 700);
          }
        });
      }

      setIsRolling(false);
    });

    newSocket.on("game-reset", (data) => {
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setGameStatus("playing");
      setWinner(null);
      setDiceValue(1);
      setIsRolling(false);
    });
    newSocket.on("player-disconnected", () => {
      setConnectionStatus("Opponent disconnected");
      setGameStatus("menu");
    });

    newSocket.on("not-your-turn", () => {
      alert("It's not your turn!");
    });

    return () => {
      newSocket.close();
    };
  }, []);
  const joinQueue = () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (socket && isConnected) {
      socket.emit("join-queue", {
        name: playerName,
        difficulty: selectedDifficulty,
      });
      setGameStatus("waiting");
    }
  };

  const rollDice = () => {
    if (
      gameStatus !== "playing" ||
      isRolling ||
      currentPlayer !== yourPlayerId
    ) {
      return;
    }

    setIsRolling(true);

    // Animate dice roll locally first
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 8) {
        clearInterval(rollInterval);
        // Send roll to server
        socket.emit("roll-dice");
      }
    }, 100);
  };

  const resetGame = () => {
    if (socket) {
      socket.emit("reset-game");
    }
  };
  const backToMenu = () => {
    // Notify server that player is leaving the game
    if (socket) {
      socket.emit("leave-game");
    }

    // Reset client state
    setGameStatus("menu");
    setPlayers({});
    setCurrentPlayer(null);
    setWinner(null);
    setDiceValue(1);
    setIsRolling(false);
    setYourPlayerId(null);
    setConnectionStatus("Connected");
    setGameBoard(null);
    setGameDifficulty("moderate");
  };

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

  const getPlayerInfo = (playerId) => {
    const player = players[playerId];
    if (!player) return null;

    return (
      <div
        className={`player ${currentPlayer === playerId ? "active" : ""} ${
          yourPlayerId === playerId ? "your-player" : ""
        }`}
      >
        <span>
          Player {player.playerNumber}{" "}
          {yourPlayerId === playerId ? "(You)" : ""}
        </span>
        <span>Position: {player.position}</span>
      </div>
    );
  };

  // Menu Screen
  if (gameStatus === "menu") {
    return (
      <div className="game-container">
        <h1>🐍 Callback Climb 🪜</h1>
        <div className="menu-container">
          <div className="connection-status">Status: {connectionStatus}</div>{" "}
          <div className="name-input">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && joinQueue()}
              className="player-name-input"
            />
            <div className="difficulty-selection">
              <label htmlFor="difficulty">Difficulty Level:</label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="difficulty-select"
              >
                <option value="easy">Easy (12 ladders, 5 snakes)</option>
                <option value="moderate">Moderate (8 ladders, 8 snakes)</option>
                <option value="hard">Hard (5 ladders, 12 snakes)</option>
              </select>
            </div>
            <button
              onClick={joinQueue}
              disabled={!isConnected || !playerName.trim()}
              className="join-button"
            >
              {isConnected ? "Find Game" : "Connecting..."}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting Screen
  if (gameStatus === "waiting") {
    return (
      <div className="game-container">
        <h1>🐍 Callback Climb 🪜</h1>
        <div className="waiting-container">
          <div className="waiting-message">
            <div className="spinner"></div>
            <h2>Waiting for an opponent...</h2>
            <p>You'll be matched automatically when another player joins!</p>
          </div>
          <button onClick={backToMenu} className="back-button">
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
        {" "}
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
            onClick={rollDice}
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
          <button onClick={resetGame} className="reset-button">
            Play Again
          </button>
          <button onClick={backToMenu} className="menu-button">
            Back to Menu
          </button>
        </div>
      )}
      <div className="board">{renderBoard()}</div>
      <div className="game-controls">
        <button onClick={backToMenu} className="leave-button">
          Leave Game
        </button>
      </div>{" "}
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

export default App;
