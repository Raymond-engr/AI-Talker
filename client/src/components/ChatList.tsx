import React from 'react';

interface ChatListProps {
  chats: string[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, onNewChat }) => {
  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chatId) => (
          <div
            key={chatId}
            onClick={() => onSelectChat(chatId)}
            className="p-2 mb-2 bg-gray-800 rounded-lg cursor-pointer"
          >
            Chat {new Date(parseInt(chatId)).toLocaleString()}
          </div>
        ))}
      </div>
      <button
        onClick={onNewChat}
        className="mt-4 bg-orange-500 text-white p-2 rounded-lg"
      >
        New Chat
      </button>
    </div>
  );
};

export default ChatList;