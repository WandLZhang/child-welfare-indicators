import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './utils/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CaseInput from './components/CaseInput';
import IndicatorList from './components/IndicatorList';
import ChatHistory from './components/ChatHistory';
import { useAuth } from './hooks/useAuth';
import { useCase } from './hooks/useCase';
import { useIndicators } from './hooks/useIndicators';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { signIn, signOut } = useAuth();
  const { currentCase, createCase, updateCase, selectCase } = useCase();
  const { indicators, addIndicator, updateIndicator, removeIndicator } = useIndicators(currentCase?.id);

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
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar user={user} />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={
                <div className="max-w-4xl mx-auto space-y-6">
                  <CaseInput 
                    onSubmit={createCase} 
                    currentCase={currentCase}
                  />
                  <IndicatorList 
                    indicators={indicators}
                    onAddIndicator={addIndicator}
                    onUpdateIndicator={updateIndicator}
                    onRemoveIndicator={removeIndicator}
                  />
                  {user && (
                    <ChatHistory 
                      caseId={currentCase?.id}
                      onSelectCase={selectCase}
                    />
                  )}
                </div>
              } />
              <Route path="/dashboard" element={
                <div className="max-w-4xl mx-auto space-y-6">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  {/* Add dashboard content here */}
                </div>
              } />
              <Route path="/about" element={
                <div className="max-w-4xl mx-auto space-y-6">
                  <h1 className="text-2xl font-bold">About</h1>
                  <p>
                    Child Welfare Indicators helps social workers and case managers track and analyze child welfare cases 
                    by identifying key positive and negative indicators that may affect case outcomes.
                  </p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;