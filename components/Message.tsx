import React from 'react';
import Image from 'next/image';

interface MessageProps {
  content: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ content, userName, userAvatar, timestamp }) => {
  return (
    <div className="flex items-start space-x-3 p-2 border-b">
      <Image
        src={userAvatar || '/default-avatar.png'}
        alt={userName}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-baseline">
          <span className="font-bold mr-2">{userName}</span>
          <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleString()}</span>
        </div>
        <p className="mt-1">{content}</p>
      </div>
    </div>
  );
};

export default Message;