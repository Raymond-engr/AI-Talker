import { Chat } from '../types';

const STORAGE_KEY = 'ai_talker_chats';

export const saveChats = (chats: Chat[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

export const loadChats = (): Chat[] => {
  const storedChats = localStorage.getItem(STORAGE_KEY);
  return storedChats ? JSON.parse(storedChats) : [];
};