import { useState, useCallback } from 'react';
import { ameliaCase } from '../utils/sampleCases';
import { extractIndicators } from '../utils/api';

export const useCase = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positiveIndicators, setPositiveIndicators] = useState([]);
  const [negativeIndicators, setNegativeIndicators] = useState([]);
  const [overallPrognosis, setOverallPrognosis] = useState(null);

  const generateSampleCase = useCallback(async () => {
    try {
      const response = await fetch('https://us-central1-wz-data-catalog-demo.cloudfunctions.net/child-welfare-generateCase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.case;
    } catch (error) {
      console.error('Error generating sample case:', error);
      throw error;
    }
  }, []);

  const submitCase = useCallback(async (caseNarrative) => {
    setIsSubmitting(true);
    setError(null);
    
    // Add user message to chat immediately
    const userMessage = {
      id: Date.now().toString(),
      content: caseNarrative,
      sender: 'anonymous',
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);

    console.log('Submitting case:', caseNarrative);

    try {
      const result = await extractIndicators(caseNarrative);
      console.log('API Response:', result);
      
      // Process indicators with weights and scores
      const processIndicators = (indicators) => indicators.map(indicator => ({
        ...indicator,
        id: Math.random().toString(36).substr(2, 9),
        weight: 1, // Default weight
        score: 1  // Default score 
      }));

      const processedPositiveIndicators = processIndicators(result.positive_indicators);
      const processedNegativeIndicators = processIndicators(result.negative_indicators);

      // Extract overall prognosis
      const processedOverallPrognosis = result.overall_prognosis.assessment;

      // Add system response to chat
      const systemMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Analysis complete',
        sender: 'system',
        timestamp: new Date(),
        indicators: {
          positive: processedPositiveIndicators,
          negative: processedNegativeIndicators,
          overall_prognosis: processedOverallPrognosis
        }
      };
      setChatHistory(prev => [...prev, systemMessage]);
      
      // Update indicators and overall prognosis
      setPositiveIndicators(processedPositiveIndicators);
      setNegativeIndicators(processedNegativeIndicators);
      setOverallPrognosis(processedOverallPrognosis);
      
      console.log('Updated Indicators:', {
        positive: processedPositiveIndicators,
        negative: processedNegativeIndicators,
        overall_prognosis: processedOverallPrognosis
      });
      
    } catch (err) {
      console.error('Error submitting case:', err);
      setError('Failed to analyze case. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Failed to analyze case. Please try again.',
        sender: 'system',
        timestamp: new Date(),
        error: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateIndicator = useCallback((id, updates) => {
    const updateIndicatorList = (list) =>
      list.map(indicator =>
        indicator.id === id ? { ...indicator, ...updates } : indicator
      );

    setPositiveIndicators(prevIndicators => updateIndicatorList(prevIndicators));
    setNegativeIndicators(prevIndicators => updateIndicatorList(prevIndicators));
  }, []);

  return {
    chatHistory,
    loading,
    error,
    isSubmitting,
    positiveIndicators,
    negativeIndicators,
    overallPrognosis,
    generateSampleCase,
    submitCase,
    updateIndicator,
  };
};