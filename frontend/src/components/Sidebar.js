import React, { useState, useEffect } from 'react';

const Sidebar = ({ positiveIndicators, negativeIndicators, updateIndicator }) => {
  const [overallScore, setOverallScore] = useState(5); // Start at neutral

  const calculateOverallScore = (positiveIndicators, negativeIndicators) => {
    const calculateWeightedSum = (indicators) => 
      indicators.reduce((sum, indicator) => sum + (indicator.score * indicator.weight), 0);

    const positiveSum = calculateWeightedSum(positiveIndicators);
    const negativeSum = calculateWeightedSum(negativeIndicators);

    const totalWeight = [...positiveIndicators, ...negativeIndicators]
      .reduce((sum, indicator) => sum + indicator.weight, 0);

    if (totalWeight === 0) return 5; // Return neutral if no indicators

    // Calculate raw score between -1 and 1
    const rawScore = (positiveSum - negativeSum) / totalWeight;
    
    // Normalize to 0-10 scale
    return (((rawScore + 1) / 2) * 10).toFixed(2);
  };

  useEffect(() => {
    const newOverallScore = calculateOverallScore(positiveIndicators, negativeIndicators);
    setOverallScore(newOverallScore);
  }, [positiveIndicators, negativeIndicators]);

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
            <p className="text-xs text-gray-600">{indicator.description}</p>
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
    <aside className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="mb-4">
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
          <h3 className="text-sm font-medium text-gray-700">Overall Prognosis Score</h3>
          <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
        </div>
        {renderIndicators(positiveIndicators, 'Positive')}
        {renderIndicators(negativeIndicators, 'Negative')}
      </div>
    </aside>
  );
};

export default Sidebar;