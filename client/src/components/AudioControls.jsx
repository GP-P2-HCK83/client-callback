import { useAudio } from "../contexts/AudioContext";
import useSweetAlert from "../hooks/useSweetAlert.jsx";
import "./AudioControls.css";

function AudioControls() {
  const {
    toggleBackgroundMusic,
    isMusicPlaying,
    isAudioEnabled,
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
  } = useAudio();

  const { showVolumeChange } = useSweetAlert();

  const handleMusicVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setMusicVolume(newVolume);
    showVolumeChange("music", newVolume);
  };

  const handleEffectsVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setEffectsVolume(newVolume);
    showVolumeChange("effects", newVolume);
  };

  if (!isAudioEnabled) {
    return (
      <div className="audio-controls">
        <div className="audio-controls-header">
          <h4>🔊 Audio Settings</h4>
        </div>
        <p style={{ textAlign: "center", color: "#666" }}>
          Click "Find Game" to enable audio controls
        </p>
      </div>
    );
  }

  return (
    <div className="audio-controls">
      <div className="audio-controls-header">
        <h4>🔊 Audio Settings</h4>
      </div>

      <div className="audio-control-item">
        <button
          onClick={toggleBackgroundMusic}
          className={`music-toggle ${isMusicPlaying ? "playing" : "paused"}`}
        >
          {isMusicPlaying ? "⏸️ Pause Music" : "▶️ Play Music"}
        </button>
      </div>

      <div className="audio-control-item">
        <label htmlFor="music-volume">🎵 Music Volume:</label>{" "}
        <input
          id="music-volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          className="volume-slider"
        />
        <span className="volume-display">{Math.round(musicVolume * 100)}%</span>
      </div>

      <div className="audio-control-item">
        <label htmlFor="effects-volume">🔊 Effects Volume:</label>{" "}
        <input
          id="effects-volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={effectsVolume}
          onChange={handleEffectsVolumeChange}
          className="volume-slider"
        />
        <span className="volume-display">
          {Math.round(effectsVolume * 100)}%
        </span>
      </div>
    </div>
  );
}

export default AudioControls;
