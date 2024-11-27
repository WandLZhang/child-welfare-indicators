import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, User, Bot, Loader } from 'lucide-react';

const ChatHistory = ({ chatHistory, isSubmitting }) => {
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
        {indicators.positive && indicators.positive.map((indicator, index) => (
          <div key={index} className="text-sm text-green-600">
            ✓ {indicator.description} (Score: {indicator.score})
          </div>
        ))}
        {indicators.negative && indicators.negative.map((indicator, index) => (
          <div key={index} className="text-sm text-red-600">
            ✗ {indicator.description} (Score: {indicator.score})
          </div>
        ))}
        {indicators.prognosis && (
          <div className="text-sm font-semibold">
            Overall Prognosis: {indicators.prognosis.score.toFixed(2)} - {indicators.prognosis.assessment}
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message) => {
    const isExpanded = expandedMessages[message.id];

    return (
      <div key={message.id} className={`mb-4 ${message.sender === 'anonymous' || message.sender.startsWith('user') ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-3/4 p-3 rounded-lg ${
          message.sender === 'anonymous' || message.sender.startsWith('user') ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <div className="flex items-center mb-1">
            {message.sender === 'anonymous' || message.sender.startsWith('user') ? (
              <User size={16} className="mr-1" />
            ) : (
              <Bot size={16} className="mr-1" />
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
          {message.indicators && (
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
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto space-y-4 mb-4"
      >
        {chatHistory.map(renderMessage)}
      </div>
      {isSubmitting && (
        <div className="flex items-center justify-center p-4">
          <Loader className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;