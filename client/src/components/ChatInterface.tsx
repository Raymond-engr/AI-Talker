import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  chatId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId }) => {
  const { socket } = useSocket();
  const { text, isListening, startListening, stopListening } = useSpeechRecognition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket) {
      socket.on('bot reply', (replyText: string) => {
        addMessage(replyText, false);
        synthVoice(replyText);
      });
    }
    return () => {
      if (socket) {
        socket.off('bot reply');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (text) {
      addMessage(text, true);
      if (socket) {
        socket.emit('chat message', text);
      }
    }
  }, [text, socket]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
  };

  const synthVoice = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText, true);
      if (socket) {
        socket.emit('chat message', inputText);
      }
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4" ref={chatRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? 'bg-blue-500 self-end' : 'bg-gray-700 self-start'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-900 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-gray-800 text-white p-2 rounded-l-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Send
        </button>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`ml-2 p-2 rounded-full ${
            isListening ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <i className="fas fa-microphone"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;