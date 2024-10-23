import React from 'react';

interface MicrophoneButtonProps {
  onClick: () => void;
  isListening: boolean;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ onClick, isListening }) => {
  return (
    <button
      onClick={onClick}
      className={`w-48 h-48 rounded-full mx-auto my-12 text-white bg-gradient-to-b from-teal-400 to-teal-500 shadow-lg transition-transform duration-300 ease-out hover:scale-95 active:brightness-90 focus:outline-none ${
        isListening ? 'animate-pulse' : ''
      }`}
    >
      <i className="fas fa-microphone text-6xl"></i>
    </button>
  );
};

export default MicrophoneButton;