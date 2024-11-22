import React from 'react';
import { useCase } from '../hooks/useCase';
import { useIndicators } from '../hooks/useIndicators';
import { Plus, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Sidebar = ({ user }) => {
  const { positiveIndicators, negativeIndicators, addIndicator } = useIndicators();
  const { chatHistory } = useCase();

  const renderIndicators = (indicators, type) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{type}</h3>
        <button
          onClick={() => addIndicator({ type: type.toLowerCase() })}
          className="text-blue-500 hover:text-blue-600"
          aria-label={`Add ${type} indicator`}
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="space-y-1">
        {indicators.map(indicator => (
          <div
            key={indicator.id}
            className="text-xs text-gray-600 py-1 px-2 bg-gray-50 rounded"
          >
            {indicator.text}
          </div>
        ))}
        {indicators.length === 0 && (
          <div className="text-xs text-gray-400 italic">
            No {type.toLowerCase()} indicators
          </div>
        )}
      </div>
    </div>
  );

  const renderChatHistory = () => (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Case History</h3>
      <div className="space-y-2">
        {chatHistory.length > 0 ? (
          chatHistory.map(chat => (
            <div
              key={chat.id}
              className="text-xs bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <MessageSquare size={12} className="text-gray-400" />
                <span className="text-gray-600 truncate">
                  {chat.content.substring(0, 30)}...
                </span>
              </div>
              <div className="text-gray-400 mt-1">
                {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-400 italic">
            No case history
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Case Indicators</h2>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Positive ({positiveIndicators.length})</span>
            <span>Negative ({negativeIndicators.length})</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${(positiveIndicators.length / (positiveIndicators.length + negativeIndicators.length)) * 100 || 0}%`
              }}
            />
          </div>
        </div>
        {renderIndicators(positiveIndicators, 'Positive')}
        {renderIndicators(negativeIndicators, 'Negative')}
      </div>
      {user && renderChatHistory()}
    </aside>
  );
};

export default Sidebar;