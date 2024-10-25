import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from './contexts/SocketContext';
import ChatInterface from './components/ChatInterface';
import NewChatPage from './components/NewChatPage';
import type { Chat, Message } from './types/global.d.ts';
import { loadChats, saveChats } from './utils/storage';

const App: React.FC = () => {
  const { socket } = useSocket();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isNewChatPage, setIsNewChatPage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', isDarkMode ? 'false' : 'true');
  };


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

  const addMessage = useCallback((chatId: number, message: Message) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  }, []);

    const handleSendMessage = useCallback((text: string, isVoice: boolean = false) => {
      if (activeChatId === null) return;
  
      const userMessage: Message = { text, sender: 'user', timestamp: new Date().toISOString() };
      addMessage(activeChatId, userMessage);
  
      if (socket) {
        const removeListener = () => {
          socket.off('aiResponse');
        };
        socket.emit('chat message', { text, isVoice });
        socket.once('aiResponse', (response: string) => {
          const aiMessage: Message = { text: response, sender: 'ai', timestamp: new Date().toISOString() };
          addMessage(activeChatId, aiMessage);
          synthVoice(response);
          removeListener();
        });
      }
    }, [activeChatId, socket, addMessage]);

  const synthVoice = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
    <div className="flex flex-col h-screen bg-black text-white"> 
    {isNewChatPage ? (<NewChatPage
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
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
    </div>
  );
};

export default App;