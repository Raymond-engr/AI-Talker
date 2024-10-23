import React from 'react';

interface ChatOutputProps {
  userText: string;
  botText: string;
}

const ChatOutput: React.FC<ChatOutputProps> = ({ userText, botText }) => {
  return (
    <div className="max-w-md mx-auto">
      <p className="mb-2">
        You said: <em className="font-semibold">{userText || '...'}</em>
      </p>
      <p>
        Bot replied: <em className="font-semibold">{botText || '...'}</em>
      </p>
    </div>
  );
};

export default ChatOutput;