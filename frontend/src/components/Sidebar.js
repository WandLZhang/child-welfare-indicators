import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit } from 'lucide-react';
import { useIndicators } from '../hooks/useIndicators';
import { useCase } from '../hooks/useCase';

const Sidebar = () => {
  const { positiveIndicators, negativeIndicators, addIndicator, removeIndicator, updateIndicator } = useIndicators();
  const { caseId, caseData } = useCase();
  const [expandedSections, setExpandedSections] = useState({ positive: true, negative: true });
  const [editingIndicator, setEditingIndicator] = useState(null);

  useEffect(() => {
    // Reset expanded sections when a new case is loaded
    setExpandedSections({ positive: true, negative: true });
  }, [caseId]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddIndicator = (type) => {
    const newIndicator = { id: Date.now(), text: '', type, source: '' };
    addIndicator(newIndicator);
    setEditingIndicator(newIndicator);
  };

  const handleEditIndicator = (indicator) => {
    setEditingIndicator(indicator);
  };

  const handleSaveIndicator = (indicator, newText) => {
    updateIndicator({ ...indicator, text: newText });
    setEditingIndicator(null);
  };

  const handleRemoveIndicator = (indicator) => {
    if (window.confirm('Are you sure you want to remove this indicator?')) {
      removeIndicator(indicator);
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
          <button
            onClick={() => handleSaveIndicator(indicator, editingIndicator.text)}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      );
    }

    return (
      <div key={indicator.id} className="flex items-center justify-between mb-2 group">
        <span className="text-sm flex-grow" title={indicator.source}>{indicator.text}</span>
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
          <Icon size={20} />
        </div>
        {isExpanded && (
          <div className="mt-2">
            {indicators.map(renderIndicator)}
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

  const positivePercentage = (positiveIndicators.length / (positiveIndicators.length + negativeIndicators.length)) * 100 || 0;
  const negativePercentage = 100 - positivePercentage;

  return (
    <aside className="w-64 bg-white shadow-md p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Case Indicators</h2>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Positive</span>
          <span>Negative</span>
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

      {caseData && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Case Details</h3>
          <p className="text-sm">ID: {caseId}</p>
          <p className="text-sm">Created: {new Date(caseData.createdAt).toLocaleDateString()}</p>
          {/* Add more case details as needed */}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
