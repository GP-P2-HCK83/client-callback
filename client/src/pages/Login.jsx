import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle.jsx";
import AudioControls from "../components/AudioControls.jsx";
import { useAudio } from "../contexts/AudioContext.jsx";
import useSweetAlert from "../hooks/useSweetAlert.jsx";

function Login({ isConnected, connectionStatus, onJoinQueue }) {
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("moderate");
  const { enableAudio, startBackgroundMusic, playSound } = useAudio();
  const { showValidationError } = useSweetAlert();
  const handleJoinQueue = () => {
    if (!playerName.trim()) {
      showValidationError("name");
      return;
    }

    // Enable audio on first user interaction
    enableAudio();

    // Play game start sound and start background music
    playSound("gameStart");
    setTimeout(() => {
      startBackgroundMusic();
    }, 500);

    onJoinQueue(playerName, selectedDifficulty);
  };

  const handleInputClick = () => {
    // Enable audio when user interacts with any input
    enableAudio();
  };

  return (
    <div className="game-container">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
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
            onClick={handleInputClick}
            className="player-name-input"
          />
          <div className="difficulty-selection">
            <label htmlFor="difficulty">Difficulty Level:</label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              onClick={handleInputClick}
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
        <AudioControls />
      </div>
    </div>
  );
}

export default Login;
