import React, { useState, useEffect } from 'react';
import { useSocket } from './contexts/SocketContext';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import ChatList from './components/ChatList';

const App: React.FC = () => {
  const { socket } = useSocket();
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chats, setChats] = useState<string[]>([]);

  useEffect(() => {
    // Load cached chats from localStorage
    const cachedChats = localStorage.getItem('chats');
    if (cachedChats) {
      setChats(JSON.parse(cachedChats));
    }
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    setChats((prevChats) => [...prevChats, newChatId]);
    setCurrentChat(newChatId);
    // Cache the new chat list
    localStorage.setItem('chats', JSON.stringify([...chats, newChatId]));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {currentChat ? (
        <>
          <Header />
          <ChatInterface chatId={currentChat} />
          <Footer onNewChat={createNewChat} />
        </>
      ) : (
        <ChatList chats={chats} onSelectChat={setCurrentChat} onNewChat={createNewChat} />
      )}
    </div>
  );
};

export default App;