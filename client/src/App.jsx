import { useState, useEffect } from "react";
import io from "socket.io-client";
import Login from "./pages/Login.jsx";
import Game from "./pages/Game.jsx";
import "./App.css";

function App() {
  // Socket and connection states
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameStatus, setGameStatus] = useState("menu"); // 'menu', 'waiting', 'playing', 'won'

  // Game states
  const [players, setPlayers] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [diceValue, setDiceValue] = useState(1);
  const [winner, setWinner] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [yourPlayerId, setYourPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState(""); // Add this line to store player name
  const [playerNames, setPlayerNames] = useState({}); // Store all player names
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [gameBoard, setGameBoard] = useState(null); // Dynamic board from AI
  const [gameDifficulty, setGameDifficulty] = useState("moderate");

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

      // Store player names if available
      if (data.playerNames) {
        setPlayerNames(data.playerNames);
      }

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

      // Update player names if provided
      if (data.playerNames) {
        setPlayerNames(data.playerNames);
      }

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

  const handleJoinQueue = (playerName, selectedDifficulty) => {
    if (socket && isConnected) {
      setPlayerName(playerName); // Store the player name
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
    setPlayerName(""); // Reset player name
    setPlayerNames({}); // Reset all player names
    setConnectionStatus("Connected");
    setGameBoard(null);
    setGameDifficulty("moderate");
  };

  // Render appropriate page based on game status
  if (gameStatus === "menu") {
    return (
      <Login
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        onJoinQueue={handleJoinQueue}
      />
    );
  }

  return (
    <Game
      gameStatus={gameStatus}
      players={players}
      currentPlayer={currentPlayer}
      diceValue={diceValue}
      winner={winner}
      isRolling={isRolling}
      yourPlayerId={yourPlayerId}
      playerName={playerName} // Pass the player name to Game component
      playerNames={playerNames} // Pass all player names
      gameBoard={gameBoard}
      gameDifficulty={gameDifficulty}
      onRollDice={rollDice}
      onResetGame={resetGame}
      onBackToMenu={backToMenu}
    />
  );
}

export default App;
