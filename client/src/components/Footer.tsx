import React from 'react';

interface FooterProps {
  onNewChat: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNewChat }) => {
  return (
    <footer className="p-4 bg-gray-900">
      <button
        onClick={onNewChat}
        className="w-full bg-orange-500 text-white p-2 rounded-lg"
      >
        New Chat
      </button>
    </footer>
  );
};

export default Footer;