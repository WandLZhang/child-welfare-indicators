import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

const CaseInput = ({ onSubmit, isSubmitting, generateSampleCase, isGeneratingSample }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting && !isGeneratingSample) {
      try {
        await onSubmit(input.trim());
        setInput('');
      } catch (error) {
        console.error('Error submitting case:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleGenerateSample = async () => {
    try {
      const sampleCase = await generateSampleCase();
      setInput(sampleCase);
    } catch (error) {
      console.error('Error generating sample case:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-start space-x-2">
        <button
          type="button"
          onClick={handleGenerateSample}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isSubmitting || isGeneratingSample}
        >
          {isGeneratingSample ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Generating...
            </>
          ) : (
            'Generate sample case'
          )}
        </button>
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter case details here..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
            disabled={isSubmitting || isGeneratingSample}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '200px' }}
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!input.trim() || isSubmitting || isGeneratingSample}
        >
          {isSubmitting ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default CaseInput;