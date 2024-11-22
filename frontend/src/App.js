import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './utils/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CaseInput from './components/CaseInput';
import IndicatorList from './components/IndicatorList';
import ChatHistory from './components/ChatHistory';
import AuthButton from './components/AuthButton';
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
      <div className="App">
        <Header>
          <AuthButton user={user} onSignIn={signIn} onSignOut={signOut} />
        </Header>
        <div className="main-content">
          <Sidebar user={user} />
          <Routes>
            <Route path="/" element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="welcome">
                  <h1>Welcome to Child Welfare Indicators</h1>
                  <p>Please sign in to access the dashboard.</p>
                </div>
              )
            } />
            <Route path="/dashboard" element={
              user ? (
                <div className="dashboard">
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
                  <ChatHistory 
                    caseId={currentCase?.id}
                    onSelectCase={selectCase}
                  />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
