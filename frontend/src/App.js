import React, { useState, useEffect } from 'react';
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CaseInput from './components/CaseInput';
import ChatHistory from './components/ChatHistory';
import { useAuth } from './hooks/useAuth';
import { useCase } from './hooks/useCase';
import { useIndicators } from './hooks/useIndicators';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { 
    currentCase, 
    createCase, 
    updateCase, 
    selectCase, 
    chatHistory, 
    isSubmitting, 
    submitCase,
    generateSampleCase
  } = useCase();
  const { positiveIndicators, negativeIndicators, setIndicators } = useIndicators();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="flex min-h-screen pt-16">
        <Sidebar 
          user={user} 
          positiveIndicators={positiveIndicators}
          negativeIndicators={negativeIndicators}
        />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <ChatHistory 
              chatHistory={chatHistory}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="case-input">
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