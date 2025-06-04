import { useRef, useEffect, useState, useCallback } from "react";

// Audio URLs - you can replace these with your own audio files
const AUDIO_URLS = {
  backgroundMusic: "/audio/background-music.mp3", // Replace with actual music
  diceRoll: "/audio/dice-roll.mp3", // Placeholder - replace with actual audio
  ladder: "/audio/ladder.mp3", // Placeholder - replace with actual audio
  snake: "/audio/snake.mp3", // Placeholder - replace with actual audio
  playerMove: "/audio/player-move.mp3", // Placeholder - replace with actual audio
  gameStart: "/audio/game-start.mp3", // Placeholder - replace with actual audio
  victory: "/audio/victory.mp3", // Placeholder - replace with actual audio
};

export const useGameAudio = () => {
  const audioRefs = useRef({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.7);

  // Initialize audio elements
  useEffect(() => {
    Object.keys(AUDIO_URLS).forEach((key) => {
      const audio = new Audio();
      audio.preload = "auto";

      // Set different volumes for music vs effects
      if (key === "backgroundMusic") {
        audio.volume = musicVolume;
        audio.loop = true;
      } else {
        audio.volume = effectsVolume;
      }

      audioRefs.current[key] = audio;
    });

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  // Update volumes when changed
  useEffect(() => {
    if (audioRefs.current.backgroundMusic) {
      audioRefs.current.backgroundMusic.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== "backgroundMusic" && audioRefs.current[key]) {
        audioRefs.current[key].volume = effectsVolume;
      }
    });
  }, [effectsVolume]);

  // Enable audio after user interaction
  const enableAudio = useCallback(() => {
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);

      // Load actual audio sources
      Object.keys(AUDIO_URLS).forEach((key) => {
        if (audioRefs.current[key]) {
          audioRefs.current[key].src = AUDIO_URLS[key];
        }
      });
    }
  }, [isAudioEnabled]);

  // Play sound effect
  const playSound = useCallback(
    (soundName) => {
      if (!isAudioEnabled || !audioRefs.current[soundName]) return;

      const audio = audioRefs.current[soundName];
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    },
    [isAudioEnabled]
  );

  // Start background music
  const startBackgroundMusic = useCallback(() => {
    if (!isAudioEnabled || !audioRefs.current.backgroundMusic) return;

    audioRefs.current.backgroundMusic
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch((e) => console.log("Background music play failed:", e));
  }, [isAudioEnabled]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (audioRefs.current.backgroundMusic) {
      audioRefs.current.backgroundMusic.pause();
      audioRefs.current.backgroundMusic.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, []);

  // Toggle background music
  const toggleBackgroundMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }, [isMusicPlaying, startBackgroundMusic, stopBackgroundMusic]);

  return {
    enableAudio,
    playSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    isAudioEnabled,
    isMusicPlaying,
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
  };
};
