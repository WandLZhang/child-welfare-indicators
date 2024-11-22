// src/hooks/useCase.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../utils/firebase'; 

const CASES_PER_PAGE = 10;

export const useCase = () => {
  const { user } = useAuth();
  const [currentCase, setCurrentCase] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);

  const loadCases = useCallback(async (loadMore = false) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let casesQuery = query(
        collection(db, 'cases'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(CASES_PER_PAGE)
      );

      if (loadMore && lastVisible) {
        casesQuery = query(
          casesQuery,
          startAfter(lastVisible)
        );
      }

      const snapshot = await getDocs(casesQuery);
      const newCases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCases(prevCases => loadMore ? [...prevCases, ...newCases] : newCases);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (err) {
      console.error('Error loading cases:', err);
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, lastVisible]);

  useEffect(() => {
    if (user) {
      loadCases();
    } else {
      setCases([]);
      setLastVisible(null);
    }
  }, [user, loadCases]);

  const createCase = useCallback(async (initialData) => {
    if (!user) throw new Error('User must be authenticated to create a case');

    setLoading(true);
    setError(null);

    try {
      const newCase = {
        ...initialData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'cases'), newCase);
      const createdCase = { id: docRef.id, ...newCase };
      
      setCases(prevCases => [createdCase, ...prevCases]);
      setCurrentCase(createdCase);
      return createdCase;
    } catch (err) {
      console.error('Error creating case:', err);
      setError('Failed to create case. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateCase = useCallback(async (caseId, updates) => {
    if (!user) throw new Error('User must be authenticated to update a case');

    setLoading(true);
    setError(null);

    try {
      const caseRef = doc(db, 'cases', caseId);
      await updateDoc(caseRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      setCases(prevCases => 
        prevCases.map(c => 
          c.id === caseId ? { ...c, ...updates, updatedAt: new Date() } : c
        )
      );

      if (currentCase && currentCase.id === caseId) {
        setCurrentCase(prevCase => ({ ...prevCase, ...updates, updatedAt: new Date() }));
      }
    } catch (err) {
      console.error('Error updating case:', err);
      setError('Failed to update case. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentCase]);

  const selectCase = useCallback(async (caseId) => {
    setLoading(true);
    setError(null);

    try {
      const selectedCase = cases.find(c => c.id === caseId);
      if (selectedCase) {
        setCurrentCase(selectedCase);
        await loadChatHistory(caseId);
      } else {
        throw new Error('Case not found');
      }
    } catch (err) {
      console.error('Error selecting case:', err);
      setError('Failed to load case details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [cases]);

  const loadChatHistory = useCallback(async (caseId) => {
    setLoading(true);
    setError(null);

    try {
      const chatQuery = query(
        collection(db, 'cases', caseId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const snapshot = await getDocs(chatQuery);
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChatHistory(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addChatMessage = useCallback(async (message, indicators = []) => {
    if (!currentCase) throw new Error('No case selected');

    setLoading(true);
    setError(null);

    try {
      const newMessage = {
        content: message,
        sender: user.uid,
        timestamp: serverTimestamp(),
        indicators
      };

      const messagesRef = collection(db, 'cases', currentCase.id, 'messages');
      const docRef = await addDoc(messagesRef, newMessage);

      const addedMessage = { id: docRef.id, ...newMessage, timestamp: new Date() };
      setChatHistory(prevHistory => [...prevHistory, addedMessage]);

      return addedMessage;
    } catch (err) {
      console.error('Error adding chat message:', err);
      setError('Failed to send message. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCase, user]);

  const generateSampleCase = useCallback(async () => {
    // This is a placeholder function. In a real application, you might call an API
    // or use a more sophisticated method to generate a sample case.
    const sampleCase = {
      childName: "Jane Doe",
      age: 7,
      situation: "Jane has been in foster care for 2 years. Her parents have completed a substance abuse program and are seeking reunification.",
      positiveIndicators: [
        "Parents completed substance abuse treatment",
        "Regular visitation maintained",
        "Child expresses desire to return home"
      ],
      negativeIndicators: [
        "History of relapse",
        "Unstable housing situation",
        "Limited family support system"
      ]
    };

    return sampleCase;
  }, []);

  return {
    currentCase,
    chatHistory,
    cases,
    loading,
    error,
    createCase,
    updateCase,
    selectCase,
    loadCases,
    addChatMessage,
    generateSampleCase
  };
};
