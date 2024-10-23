import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Chat } from '../types';

interface NewChatPageProps {
  chats: Chat[];
  onSelectChat: (chatId: number) => void;
  onCreateNewChat: () => void;
}

const NewChatPage: React.FC<NewChatPageProps> = ({ chats, onSelectChat, onCreateNewChat }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-300"
          >
            <h2 className="font-semibold">Chat {chat.id}</h2>
            <p className="text-gray-500 truncate">
              {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(chat.messages[chat.messages.length - 1]?.timestamp || Date.now()).toLocaleString()}
            </p>
          </button>
        ))}
      </main>

      <footer className="bg-white p-4 shadow">
        <button
          onClick={onCreateNewChat}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Chat
        </button>
      </footer>
    </div>
  );
};

export default NewChatPage;