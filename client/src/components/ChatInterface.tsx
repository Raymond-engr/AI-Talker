import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Chat, Message } from '../types/global.d.ts';
import Header from './Header';
import DarkModeToggle from './DarkModeToggle';

interface ChatInterfaceProps {
  chat: Chat;
  onSendMessage: (text: string, isVoice?: boolean) => void;
  onNewChat: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onSendMessage, onNewChat, isDarkMode, toggleDarkMode }) => {
  const { text, isListening, startListening, stopListening } = useSpeechRecognition();
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat.messages]);

  useEffect(() => {
    if (text) {
      onSendMessage(text, true);
    }
  }, [text, onSendMessage]);

  const handleSpeak = () => {
    startListening();
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <>
    <Header />
    <main className="flex-1 flex flex-col overflow-hidden">
    <div className="dark:bg-gray-400 bg-gray-100 p-4 text-center">
          {!isListening ? (
            <button
              onClick={handleSpeak}
              className="bg-blue-500 text-gray-900 dark:text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              SPEAK
            </button>
          ) : (
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-100 animate-pulse">
              Listening...
            </div>
          )}
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
        </div>

      <div className="flex-1 bg-gray-200 dark:bg-gray-800 overflow-y-auto p-4" ref={chatContainerRef}>
        {chat.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>
        </main>

    <footer className="p-4 bg-white dark:bg-gray-600 shadow">
      <div className="flex items-center space-x-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-white dark:bg-gray-400 text-black dark:text-white p-2 border rounded-lg placeholder:text-gray-500"
          placeholder="Type a message..."
        />
       <button
            onClick={isListening ? stopListening : handleSpeak}
            className={`text-white ml-2 p-2 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            <FontAwesomeIcon icon={faMicrophone} size="lg" />
          </button>
          <button
            onClick={handleSendText}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
      </div>
      <button
          onClick={onNewChat}
          className="mt-2 w-full bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Chat
        </button>
      </footer>
    </>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div
    className={`flex justify-end mb-1 p-3 rounded-lg ${
      message.sender === 'user' ? 'bg-blue-600 dark:bg-blue-500 ml-auto' : 'bg-gray-700 mr-auto'
    } max-w-[80%] inline-block w-fit`}
  >
    {message.text}
  </div>
);

export default ChatInterface;