export interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Chat {
  id: number;
  messages: Message[];
}