import React from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useIndicators } from '../hooks/useIndicators';

const IndicatorList = () => {
  const { positiveIndicators, negativeIndicators, addIndicator, removeIndicator, updateIndicator } = useIndicators();

  const handleAddIndicator = (type) => {
    const newIndicator = { id: Date.now(), text: '', type, source: '' };
    addIndicator(newIndicator);
  };

  const handleRemoveIndicator = (indicator) => {
    if (window.confirm('Are you sure you want to remove this indicator?')) {
      removeIndicator(indicator);
    }
  };

  const renderIndicators = (indicators, type) => (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900">{type}</h3>
        <button
          onClick={() => handleAddIndicator(type.toLowerCase())}
          className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
        >
          <Plus size={16} />
          <span className="text-sm">Add</span>
        </button>
      </div>
      <div className="space-y-2">
        {indicators.map(indicator => (
          <div 
            key={indicator.id} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded group hover:bg-gray-100"
          >
            <span className="text-sm text-gray-700">{indicator.text}</span>
            <div className="hidden group-hover:flex space-x-2">
              <button
                onClick={() => updateIndicator({ ...indicator, text: prompt('Update indicator:', indicator.text) })}
                className="text-blue-500 hover:text-blue-600"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleRemoveIndicator(indicator)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {indicators.length === 0 && (
          <div className="text-sm text-gray-400 italic">
            No {type.toLowerCase()} indicators added
          </div>
        )}
      </div>
    </div>
  );

  const totalIndicators = positiveIndicators.length + negativeIndicators.length;
  const positivePercentage = totalIndicators > 0 ? (positiveIndicators.length / totalIndicators) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Case Analysis</h2>
        <span className="text-sm text-gray-500">
          {totalIndicators} indicators
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Positive ({positiveIndicators.length})</span>
          <span>Negative ({negativeIndicators.length})</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${positivePercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderIndicators(positiveIndicators, 'Positive')}
        {renderIndicators(negativeIndicators, 'Negative')}
      </div>
    </div>
  );
};

export default IndicatorList;