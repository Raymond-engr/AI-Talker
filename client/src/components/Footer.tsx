import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  onNewChat: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNewChat }) => {
  return (
    <footer className="p-4 bg-white dark:bg-gray-600 shadow">
      <button
        onClick={onNewChat}
        className="w-full bg-blue-600 text-blackdark:text-white p-2 rounded-lg flex items-center justify-center"
      >
      <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Chat
      </button>
    </footer>
  );
};

export default Footer;