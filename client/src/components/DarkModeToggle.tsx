import React from 'react';
import { Sun, Moon } from 'lucide-react'; // Icons for light and dark mode from lucide-react

interface DarkModeToggleProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  };
  
const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />}
    </button>
  );
};

export default DarkModeToggle;