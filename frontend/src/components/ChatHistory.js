import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCase } from '../hooks/useCase';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, User, Bot } from 'lucide-react';

const ChatHistory = () => {
  const { user } = useAuth();
  const { chatHistory, loadMoreHistory, hasMoreHistory } = useCase();
  const [expandedMessages, setExpandedMessages] = useState({});
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const renderIndicators = (indicators) => {
    return (
      <div className="mt-2 space-y-1">
        {indicators.map((indicator, index) => (
          <div key={index} className={`text-sm ${indicator.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {indicator.type === 'positive' ? '✓' : '✗'} {indicator.text}
          </div>
        ))}
      </div>
    );
  };

  const renderMessage = (message) => {
    const isExpanded = expandedMessages[message.id];

    return (
      <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-3/4 p-3 rounded-lg ${
          message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <div className="flex items-center mb-1">
            {message.sender === 'user' ? (
              <User size={16} className="mr-1" />
            ) : (
              <Bot size={16} className="mr-1" />
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
          {message.indicators && message.indicators.length > 0 && (
            <button
              onClick={() => toggleMessageExpansion(message.id)}
              className="mt-2 text-xs text-blue-600 hover:underline focus:outline-none"
            >
              {isExpanded ? 'Hide' : 'Show'} Indicators
              {isExpanded ? <ChevronUp size={12} className="inline ml-1" /> : <ChevronDown size={12} className="inline ml-1" />}
            </button>
          )}
          {isExpanded && message.indicators && renderIndicators(message.indicators)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      {user ? (
        <>
          {hasMoreHistory && (
            <button
              onClick={loadMoreHistory}
              className="mb-4 text-blue-600 hover:underline focus:outline-none"
            >
              Load More History
            </button>
          )}
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto space-y-4 mb-4"
          >
            {chatHistory.map(renderMessage)}
          </div>
        </>
      ) : (
        <p className="text-gray-500 italic">Please sign in to view chat history.</p>
      )}
    </div>
  );
};

export default ChatHistory;
