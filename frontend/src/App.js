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
    <div className="App flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden pt-4">
        <Sidebar 
          positiveIndicators={positiveIndicators}
          negativeIndicators={negativeIndicators}
          updateIndicator={updateIndicator}
        />
        <main className="flex-1 flex flex-col overflow-hidden px-4 pt-10">
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