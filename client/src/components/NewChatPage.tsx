import React from 'react';
import Footer from '../components/Footer';
import type { Chat } from '../types/global.d.ts';

interface NewChatPageProps {
  chats: Chat[];
  onSelectChat: (chatId: number) => void;
  onCreateNewChat: () => void;
}

const NewChatPage: React.FC<NewChatPageProps> = ({ chats, onSelectChat, onCreateNewChat }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-400">
      <header className="bg-gray-400 p-4 shadow">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left px-2 py-1 bg-gray-500 rounded-lg shadow hover:bg-gray-600 transition duration-300"
          >
            <h2 className="font-semibold">Chat {chat.id}</h2>
            <p className="text-gray-300 truncate">
              {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(chat.messages[chat.messages.length - 1]?.timestamp || Date.now()).toLocaleString()}
            </p>
          </button>
        ))}
      </main>
      <Footer onNewChat={onCreateNewChat} />
      </div>
  );
};

export default NewChatPage;