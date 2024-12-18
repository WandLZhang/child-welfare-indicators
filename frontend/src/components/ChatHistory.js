import React, { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';

const ChatHistory = ({ chatHistory, isSubmitting }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const renderIndicators = (indicators) => {
    return (
      <div className="mt-2 space-y-1">
        {indicators.overall_prognosis && (
          <div className="text-sm font-semibold">
            Overall Prognosis: {indicators.overall_prognosis}
          </div>
        )}
        {indicators.positive && (
          <div className="text-sm">
            <span className="font-semibold">Positive Indicators:</span> {indicators.positive.length}
          </div>
        )}
        {indicators.negative && (
          <div className="text-sm">
            <span className="font-semibold">Negative Indicators:</span> {indicators.negative.length}
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message) => {
    return (
      <div key={message.id} className={`mb-4 ${message.sender === 'anonymous' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-3/4 p-3 rounded-lg ${
            message.sender === 'anonymous' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {message.content !== 'Analysis complete' && (
              <p className="text-sm">{message.content}</p>
            )}
            {message.indicators && renderIndicators(message.indicators)}
          </div>
      </div>
    );
  };

  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-16rem)]">
      {chatHistory.map(renderMessage)}
      {isSubmitting && (
        <div className="flex items-center justify-center p-4">
          <Loader className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;