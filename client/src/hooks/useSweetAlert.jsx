import { useCallback } from "react";
import Swal from "sweetalert2";

const useSweetAlert = () => {
  // Custom theme configuration for the game
  const defaultConfig = {
    customClass: {
      popup: "game-swal-popup",
      header: "game-swal-header",
      title: "game-swal-title",
      content: "game-swal-content",
      confirmButton: "game-swal-confirm-btn",
      cancelButton: "game-swal-cancel-btn",
    },
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    confirmButtonColor: "#4CAF50",
    cancelButtonColor: "#f44336",
    showConfirmButton: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
  };

  // Success alert (for positive game events)
  const showSuccess = useCallback((title, text = "", options = {}) => {
    return Swal.fire({
      ...defaultConfig,
      icon: "success",
      title,
      text,
      iconColor: "#4CAF50",
      timer: 3000,
      timerProgressBar: true,
      ...options,
    });
  }, []);

  // Info alert (for general game notifications)
  const showInfo = useCallback((title, text = "", options = {}) => {
    return Swal.fire({
      ...defaultConfig,
      icon: "info",
      title,
      text,
      iconColor: "#2196F3",
      timer: 4000,
      timerProgressBar: true,
      ...options,
    });
  }, []);

  // Warning alert (for important game messages)
  const showWarning = useCallback((title, text = "", options = {}) => {
    return Swal.fire({
      ...defaultConfig,
      icon: "warning",
      title,
      text,
      iconColor: "#FF9800",
      ...options,
    });
  }, []);

  // Error alert (for errors or invalid actions)
  const showError = useCallback((title, text = "", options = {}) => {
    return Swal.fire({
      ...defaultConfig,
      icon: "error",
      title,
      text,
      iconColor: "#f44336",
      ...options,
    });
  }, []);

  // Game event alerts with custom styling
  const showGameEvent = useCallback((type, title, text = "", options = {}) => {
    const gameEventConfig = {
      ...defaultConfig,
      html: `
        <div class="game-event-alert">
          <div class="game-event-icon">${getGameIcon(type)}</div>
          <h3 class="game-event-title">${title}</h3>
          ${text ? `<p class="game-event-text">${text}</p>` : ""}
        </div>
      `,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      position: "top-end",
      toast: true,
      ...options,
    };

    return Swal.fire(gameEventConfig);
  }, []);

  // Ladder climb event
  const showLadderClimb = useCallback(
    (fromPosition, toPosition) => {
      return showGameEvent(
        "ladder",
        "🪜 Ladder Boost!",
        `Climbed from ${fromPosition} to ${toPosition}!`,
        { iconColor: "#4CAF50", timer: 2500 }
      );
    },
    [showGameEvent]
  );

  // Snake bite event
  const showSnakeBite = useCallback(
    (fromPosition, toPosition) => {
      return showGameEvent(
        "snake",
        "🐍 Snake Bite!",
        `Slid down from ${fromPosition} to ${toPosition}!`,
        { iconColor: "#f44336", timer: 2500 }
      );
    },
    [showGameEvent]
  );

  // Extra turn notification
  const showExtraTurn = useCallback(() => {
    return showGameEvent(
      "dice",
      "🎲 Extra Turn!",
      "You rolled a 6! Roll again!",
      { iconColor: "#FF9800", timer: 2000 }
    );
  }, [showGameEvent]);

  // Victory celebration
  const showVictory = useCallback(
    (isWinner = true) => {
      const title = isWinner ? "🏆 Victory!" : "💔 Game Over";
      const text = isWinner
        ? "Congratulations! You won!"
        : "Better luck next time!";
      const iconColor = isWinner ? "#4CAF50" : "#FF9800";

      return showGameEvent("victory", title, text, {
        iconColor,
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: "Play Again?",
        position: "center",
        toast: false,
      });
    },
    [showGameEvent]
  );

  // Player sent back notification
  const showPlayerSentBack = useCallback(
    (playerNumber) => {
      return showGameEvent(
        "collision",
        "💥 Player Collision!",
        `Player ${playerNumber} was sent back to position 1!`,
        { iconColor: "#FF5722", timer: 2500 }
      );
    },
    [showGameEvent]
  );

  // Connection status alerts
  const showConnectionError = useCallback(
    (message = "Connection lost") => {
      return showError("🔌 Connection Issue", message, {
        timer: false,
        showConfirmButton: true,
        confirmButtonText: "Retry",
      });
    },
    [showError]
  );

  // Form validation alert
  const showValidationError = useCallback(
    (field = "field") => {
      return showError("📝 Required Field", `Please enter your ${field}!`, {
        timer: 3000,
      });
    },
    [showError]
  );

  // Board generation notification
  const showBoardInfo = useCallback(
    (message) => {
      return showInfo("🤖 Board Info", message, {
        timer: 4000,
        position: "top-end",
        toast: true,
      });
    },
    [showInfo]
  );

  // Volume control feedback
  const showVolumeChange = useCallback(
    (type, level) => {
      const icon = type === "music" ? "🎵" : "🔊";
      return showGameEvent(
        "volume",
        `${icon} ${type.charAt(0).toUpperCase() + type.slice(1)} Volume`,
        `Set to ${Math.round(level * 100)}%`,
        {
          timer: 1500,
          timerProgressBar: false,
          position: "bottom-end",
        }
      );
    },
    [showGameEvent]
  );

  // Helper function to get appropriate icons for game events
  const getGameIcon = (type) => {
    const icons = {
      ladder: "🪜",
      snake: "🐍",
      dice: "🎲",
      victory: "🏆",
      collision: "💥",
      volume: "🔊",
      music: "🎵",
    };
    return icons[type] || "🎮";
  };

  return {
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showGameEvent,
    showLadderClimb,
    showSnakeBite,
    showExtraTurn,
    showVictory,
    showPlayerSentBack,
    showConnectionError,
    showValidationError,
    showBoardInfo,
    showVolumeChange,
  };
};

export default useSweetAlert;
