import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CaseInput from './components/CaseInput';
import ChatHistory from './components/ChatHistory';
import { useCase } from './hooks/useCase';
import './App.css';

function App() {
  const { 
    chatHistory, 
    isSubmitting, 
    submitCase,
    generateSampleCase,
    positiveIndicators,
    negativeIndicators,
    updateIndicator
  } = useCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar 
          positiveIndicators={positiveIndicators}
          negativeIndicators={negativeIndicators}
          updateIndicator={updateIndicator}
        />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatHistory 
              chatHistory={chatHistory}
              isSubmitting={isSubmitting}
            />
            <CaseInput 
              onSubmit={submitCase}
              isSubmitting={isSubmitting}
              generateSampleCase={generateSampleCase}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;