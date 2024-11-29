import React, { useState } from 'react';
import { Plus, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicators } from '../hooks/useIndicators';

const IndicatorList = ({ positiveIndicators, negativeIndicators, updateIndicator }) => {
  const { addIndicator, removeIndicator } = useIndicators();
  const [expandedIndicators, setExpandedIndicators] = useState({});

  const handleAddIndicator = (type) => {
    const newIndicator = { id: Date.now(), text: '', type, source: '', weight: 1, score: 1 };
    addIndicator(newIndicator);
  };

  const handleRemoveIndicator = (indicator) => {
    if (window.confirm('Are you sure you want to remove this indicator?')) {
      removeIndicator(indicator);
    }
  };

  const handleUpdateIndicator = (id, field, value) => {
    updateIndicator(id, { [field]: value });
  };

  const toggleDescription = (id) => {
    setExpandedIndicators(prev => ({ ...prev, [id]: !prev[id] }));
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
            className="flex flex-col p-2 bg-gray-50 rounded group hover:bg-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">{indicator.category}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateIndicator(indicator.id, 'category', prompt('Update indicator category:', indicator.category))}
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
            <div className="text-xs text-gray-600 mb-2">
              {expandedIndicators[indicator.id] 
                ? indicator.description 
                : `${indicator.description.slice(0, 100)}...`}
            </div>
            <button 
              onClick={() => toggleDescription(indicator.id)}
              className="text-xs text-blue-500 hover:text-blue-600 flex items-center self-start mb-2"
            >
              {expandedIndicators[indicator.id] ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  See more
                </>
              )}
            </button>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-500">Weight:</label>
                <input
                  type="number"
                  value={indicator.weight}
                  onChange={(e) => handleUpdateIndicator(indicator.id, 'weight', parseFloat(e.target.value))}
                  className="w-16 text-xs border rounded px-1"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-500">Score:</label>
                <input
                  type="number"
                  value={indicator.score}
                  onChange={(e) => handleUpdateIndicator(indicator.id, 'score', parseFloat(e.target.value))}
                  className="w-16 text-xs border rounded px-1"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
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