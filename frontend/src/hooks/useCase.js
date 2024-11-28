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

  const generateSampleCase = useCallback(() => {
    return ameliaCase;
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
      
      // Add system response to chat
      const systemMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Analysis complete',
        sender: 'system',
        timestamp: new Date(),
        indicators: {
          positive: result.positive_indicators,
          negative: result.negative_indicators,
          prognosis: result.overall_prognosis
        }
      };
      setChatHistory(prev => [...prev, systemMessage]);
      
      // Update indicators
      setPositiveIndicators(result.positive_indicators);
      setNegativeIndicators(result.negative_indicators);
      
      console.log('Updated Indicators:', {
        positive: result.positive_indicators,
        negative: result.negative_indicators
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

  return {
    chatHistory,
    loading,
    error,
    isSubmitting,
    positiveIndicators,
    negativeIndicators,
    generateSampleCase,
    submitCase,
  };
};