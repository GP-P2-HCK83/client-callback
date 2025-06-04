import { useState } from "react";
// import "./Login.css";

function Login({ isConnected, connectionStatus, onJoinQueue }) {
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("moderate");

  const handleJoinQueue = () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }

    onJoinQueue(playerName, selectedDifficulty);
  };

  return (
    <div className="game-container">
      <h1>🐍 Callback Climb 🪜</h1>
      <div className="menu-container">
        <div className="connection-status">Status: {connectionStatus}</div>
        <div className="name-input">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleJoinQueue()}
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
            onClick={handleJoinQueue}
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

export default Login;