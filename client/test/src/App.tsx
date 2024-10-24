import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatInterface from './components/ChatInterface';
import NewChatPage from './components/NewChatPage';
import { Chat, Message } from './types';
import { loadChats, saveChats } from './utils/storage';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isNewChatPage, setIsNewChatPage] = useState(false);

  useEffect(() => {
    const savedChats = loadChats();
    if (savedChats.length > 0) {
      setChats(savedChats);
      setActiveChatId(savedChats[0].id);
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const createNewChat = () => {
    const newChatId = Date.now();
    setChats(prevChats => [...prevChats, { id: newChatId, messages: [] }]);
    setActiveChatId(newChatId);
    setIsNewChatPage(false);
  };

  const addMessage = (chatId: number, message: Message) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const handleSendMessage = (text: string, isVoice: boolean = false) => {
    if (activeChatId === null) return;

    const userMessage: Message = { text, sender: 'user', timestamp: new Date().toISOString() };
    addMessage(activeChatId, userMessage);

    if (socket) {
      socket.emit('sendMessage', { text, isVoice });
      socket.once('aiResponse', (response: string) => {
        const aiMessage: Message = { text: response, sender: 'ai', timestamp: new Date().toISOString() };
        addMessage(activeChatId, aiMessage);
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {isNewChatPage ? (
        <NewChatPage
          chats={chats}
          onSelectChat={(chatId) => {
            setActiveChatId(chatId);
            setIsNewChatPage(false);
          }}
          onCreateNewChat={createNewChat}
        />
      ) : (
        <ChatInterface
          chat={chats.find(chat => chat.id === activeChatId) || { id: 0, messages: [] }}
          onSendMessage={handleSendMessage}
          onNewChat={() => setIsNewChatPage(true)}
        />
      )}
    </div>
  );
};

export default App;