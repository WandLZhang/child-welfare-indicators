import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X } from 'lucide-react';
import { useCase } from '../hooks/useCase';
import { useAuth } from '../hooks/useAuth';

const CaseInput = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { user } = useAuth();
  const { submitCase, isSubmitting, generateSampleCase } = useCase();
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(prevInput => prevInput + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

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
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleGenerateSample = async () => {
    const sampleCase = await generateSampleCase();
    setInput(sampleCase);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleGenerateSample}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
            disabled={isSubmitting}
          >
            Generate sample case
          </button>
          {user && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 ${
                isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <X size={24} /> : <Mic size={24} />}
            </button>
          )}
          {isRecording && (
            <span className="text-sm text-gray-500">
              Recording: {recordingTime}s
            </span>
          )}
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Enter case details here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
            rows={1}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
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
