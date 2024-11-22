import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X } from 'lucide-react';
import { useCase } from '../hooks/useCase';

const CaseInput = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { submitCase, isSubmitting, generateSampleCase } = useCase();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [input]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setInput('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting) {
      await submitCase(input.trim());
      setInput('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleGenerateSample = async () => {
    const sampleCase = await generateSampleCase();
    setInput(sampleCase);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <div className="flex items-center h-full">
        <button
          type="button"
          onClick={handleGenerateSample}
          className="h-10 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 whitespace-nowrap"
          disabled={isSubmitting}
        >
          Generate sample case
        </button>
      </div>
      <div className="flex items-center h-full">
        <button
          type="button"
          onClick={toggleRecording}
          className={`h-10 w-10 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ${
            isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {isRecording ? <X size={20} /> : <Mic size={20} />}
        </button>
        </div>
        <div className="flex-grow relative flex items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter case details here..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
            disabled={isSubmitting}
            rows={1}
          />
        </div>
        <div className="flex items-center h-full">
        <button
          type="submit"
          className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          disabled={!input.trim() || isSubmitting}
        >
          <Send size={20} />
        </button>
        </div>
      </form>
    </div>
  );
};

export default CaseInput;