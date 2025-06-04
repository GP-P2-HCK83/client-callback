import { createContext, useContext } from 'react';
import { useGameAudio } from '../hooks/useGameAudio';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const audioControls = useGameAudio();

  return (
    <AudioContext.Provider value={audioControls}>
      {children}
    </AudioContext.Provider>
  );
};