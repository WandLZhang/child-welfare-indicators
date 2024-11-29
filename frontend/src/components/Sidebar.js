import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = ({ positiveIndicators, negativeIndicators, updateIndicator }) => {
  const [overallScore, setOverallScore] = useState(5);
  const [expandedIndicators, setExpandedIndicators] = useState({});

  const calculateOverallScore = (positiveIndicators, negativeIndicators) => {
    const calculateWeightedSum = (indicators) => 
      indicators.reduce((sum, indicator) => sum + (indicator.score * indicator.weight), 0);

    const positiveSum = calculateWeightedSum(positiveIndicators);
    const negativeSum = calculateWeightedSum(negativeIndicators);

    const totalWeight = [...positiveIndicators, ...negativeIndicators]
      .reduce((sum, indicator) => sum + indicator.weight, 0);

    if (totalWeight === 0) return 5;

    const rawScore = (positiveSum - negativeSum) / totalWeight;
    return (((rawScore + 1) / 2) * 10).toFixed(2);
  };

  useEffect(() => {
    const newOverallScore = calculateOverallScore(positiveIndicators, negativeIndicators);
    setOverallScore(newOverallScore);
  }, [positiveIndicators, negativeIndicators]);

  const toggleDescription = (id) => {
    setExpandedIndicators(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIndicators = (indicators, type) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{type}</h3>
      </div>
      <div className="space-y-2">
        {indicators.map(indicator => (
          <div
            key={indicator.id}
            className={`p-2 rounded-lg ${
              type === 'Positive' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{indicator.category}</span>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-14 text-xs border rounded px-1"
                  value={indicator.weight}
                  onChange={(e) => updateIndicator(indicator.id, { weight: parseFloat(e.target.value) })}
                  min="0"
                  max="10"
                  step="0.1"
                />
                <input
                  type="number"
                  className="w-14 text-xs border rounded px-1"
                  value={indicator.score}
                  onChange={(e) => updateIndicator(indicator.id, { score: parseFloat(e.target.value) })}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
            {expandedIndicators[indicator.id] && (
              <p className="text-xs text-gray-600 mt-1">
                {indicator.description}
              </p>
            )}
            <button
              onClick={() => toggleDescription(indicator.id)}
              className="text-xs text-blue-600 mt-1 hover:underline flex items-center"
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

  const totalIndicators = positiveIndicators.length + negativeIndicators.length;
  const positivePercentage = totalIndicators > 0 ? (positiveIndicators.length / totalIndicators) * 100 : 50;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Case Indicators</h2>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Positive ({positiveIndicators.length})</span>
            <span>Negative ({negativeIndicators.length})</span>
          </div>
          <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-200"
              style={{ width: `${positivePercentage}%` }}
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-700 mr-1">Overall Prognosis Score</h3>
            <div className="relative group">
              <Info size={16} className="text-gray-400 cursor-help" />
              <div className="absolute left-full ml-2 w-64 bg-white p-2 rounded shadow-lg text-xs text-gray-600 hidden group-hover:block">
                The overall prognosis score is calculated based on the weight and score of each indicator. Weight and score range from 0 to 10. A higher score indicates a more positive prognosis.
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
        </div>
        {renderIndicators(positiveIndicators, 'Positive')}
        {renderIndicators(negativeIndicators, 'Negative')}
      </div>
    </aside>
  );
};

export default Sidebar;