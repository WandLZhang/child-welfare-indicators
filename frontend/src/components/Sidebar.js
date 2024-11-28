import React from 'react';

const Sidebar = ({ positiveIndicators, negativeIndicators }) => {
  const renderIndicators = (indicators, type) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{type}</h3>
      </div>
      <div className="space-y-1">
        {indicators.map(indicator => (
          <div
            key={indicator.id}
            className={`text-xs py-1 px-2 rounded cursor-pointer relative group ${
              type === 'Positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            title={indicator.description}
          >
            {indicator.category}
            <span className="invisible group-hover:visible absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded z-10 w-48">
              {indicator.description}
            </span>
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
        {renderIndicators(positiveIndicators, 'Positive')}
        {renderIndicators(negativeIndicators, 'Negative')}
      </div>
    </aside>
  );
};

export default Sidebar;