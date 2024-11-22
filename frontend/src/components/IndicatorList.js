import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useIndicators } from '../hooks/useIndicators';
import { useToast, TOAST_TYPES } from '../hooks/useToast';

const IndicatorList = () => {
  const { positiveIndicators, negativeIndicators, addIndicator, removeIndicator, updateIndicator } = useIndicators();
  const { showSuccessToast, showErrorToast, showWarningToast } = useToast();
  const [expandedSections, setExpandedSections] = useState({ positive: true, negative: true });
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [hoveredIndicator, setHoveredIndicator] = useState(null);

  useEffect(() => {
    // Reset expanded sections when indicators change
    setExpandedSections({ positive: true, negative: true });
  }, [positiveIndicators.length, negativeIndicators.length]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddIndicator = (type) => {
    const newIndicator = { id: Date.now(), text: '', type, source: '', confidence: 0.5 };
    addIndicator(newIndicator);
    setEditingIndicator(newIndicator);
    showSuccessToast(`New ${type} indicator added. Please edit its details.`);
  };

  const handleEditIndicator = (indicator) => {
    setEditingIndicator(indicator);
  };

  const handleSaveIndicator = (indicator, newText, newConfidence) => {
    if (!newText.trim()) {
      showErrorToast('Indicator text cannot be empty.');
      return;
    }
    
    const updatedIndicator = { 
      ...indicator, 
      text: newText.trim(), 
      confidence: parseFloat(newConfidence) 
    };
    
    updateIndicator(updatedIndicator);
    setEditingIndicator(null);
    showSuccessToast('Indicator updated successfully');
  };

  const handleRemoveIndicator = (indicator) => {
    if (window.confirm('Are you sure you want to remove this indicator?')) {
      removeIndicator(indicator);
      showWarningToast(`${indicator.type.charAt(0).toUpperCase() + indicator.type.slice(1)} indicator removed`);
    }
  };

  const renderIndicator = (indicator) => {
    if (editingIndicator && editingIndicator.id === indicator.id) {
      return (
        <div key={indicator.id} className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={editingIndicator.text}
            onChange={(e) => setEditingIndicator({ ...editingIndicator, text: e.target.value })}
            className="flex-grow p-1 text-sm border rounded"
            autoFocus
          />
          <input
            type="number"
            value={editingIndicator.confidence}
            onChange={(e) => setEditingIndicator({ ...editingIndicator, confidence: e.target.value })}
            className="w-20 p-1 text-sm border rounded"
            min="0"
            max="1"
            step="0.1"
          />
          <button
            onClick={() => handleSaveIndicator(indicator, editingIndicator.text, editingIndicator.confidence)}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      );
    }

    return (
      <div
        key={indicator.id}
        className="flex items-center justify-between mb-2 group relative"
        onMouseEnter={() => setHoveredIndicator(indicator)}
        onMouseLeave={() => setHoveredIndicator(null)}
      >
        <div className="flex items-center space-x-2 flex-grow">
          <span className="text-sm flex-grow">{indicator.text}</span>
          <span className="text-xs text-gray-500">
            {(indicator.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="hidden group-hover:flex space-x-1">
          <button
            onClick={() => handleEditIndicator(indicator)}
            className="p-1 text-blue-500 hover:text-blue-600"
            aria-label="Edit indicator"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleRemoveIndicator(indicator)}
            className="p-1 text-red-500 hover:text-red-600"
            aria-label="Remove indicator"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {hoveredIndicator === indicator && indicator.source && (
          <div className="absolute left-0 -top-8 bg-gray-800 text-white p-2 rounded text-xs z-10">
            Source: {indicator.source}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title, indicators, type) => {
    const isExpanded = expandedSections[type];
    const Icon = isExpanded ? ChevronUp : ChevronDown;

    return (
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer bg-gray-100 p-2 rounded"
          onClick={() => toggleSection(type)}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{indicators.length}</span>
            <Icon size={20} />
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2">
            {indicators.length === 0 ? (
              <div className="text-sm text-gray-500 italic">No indicators found</div>
            ) : (
              indicators.map(renderIndicator)
            )}
            <button
              onClick={() => handleAddIndicator(type)}
              className="flex items-center text-blue-500 hover:text-blue-600 mt-2"
            >
              <Plus size={16} className="mr-1" /> Add {type} indicator
            </button>
          </div>
        )}
      </div>
    );
  };

  const totalIndicators = positiveIndicators.length + negativeIndicators.length;
  const positivePercentage = totalIndicators > 0 ? (positiveIndicators.length / totalIndicators) * 100 : 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
        Case Indicators
        <span className="text-sm font-normal text-gray-500">
          Total: {totalIndicators}
        </span>
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Positive ({positiveIndicators.length})</span>
          <span>Negative ({negativeIndicators.length})</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${positivePercentage}%` }}
          />
        </div>
      </div>

      {renderSection('Positive Indicators', positiveIndicators, 'positive')}
      {renderSection('Negative Indicators', negativeIndicators, 'negative')}

      {totalIndicators === 0 && (
        <div className="flex items-center justify-center text-gray-500 mt-4">
          <AlertCircle size={20} className="mr-2" />
          <span>No indicators found. Start by adding some indicators.</span>
        </div>
      )}
    </div>
  );
};

export default IndicatorList;
