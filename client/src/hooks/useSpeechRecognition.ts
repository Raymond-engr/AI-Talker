import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseSpeechRecognitionReturn {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = useMemo(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;
      return recognitionInstance;
    }
    return null;
  }, [SpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognition) {
      setText('');
      setIsListening(true);
      recognition.start();
    } else {
      console.error('SpeechRecognition API not supported by this browser.');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  }, [recognition]);
  
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      setText(transcript);
      stopListening();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      stopListening();
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.abort();
    };
  }, [recognition, stopListening]);

  return { text, isListening, startListening, stopListening };
};