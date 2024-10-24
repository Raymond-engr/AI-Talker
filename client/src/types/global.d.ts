declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}
}

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Chat {
  id: number;
  messages: Message[];
}

export {};