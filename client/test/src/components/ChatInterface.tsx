import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Chat, Message } from '../types';

interface ChatInterfaceProps {
  chat: Chat;
  onSendMessage: (text: string, isVoice?: boolean) => void;
  onNewChat: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onSendMessage, onNewChat }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSpeak = () => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSendMessage(transcript, true);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <>
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">AI Talker</h1>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 text-center">
          {!isListening ? (
            <button
              onClick={handleSpeak}
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              SPEAK
            </button>
          ) : (
            <div className="text-lg font-semibold text-gray-600 animate-pulse">
              Listening...
            </div>
          )}
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chat.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </main>

      <footer className="bg-white p-4 shadow">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSpeak}
            className="bg-blue-500 text-white p-2 rounded-full"
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
          className="mt-2 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Chat
        </button>
      </footer>
    </>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div
    className={`p-3 rounded-lg ${
      message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
    } max-w-[80%]`}
  >
    {message.text}
  </div>
);

export default ChatInterface;