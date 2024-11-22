import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export const useIndicators = (caseId) => {
  const { user } = useAuth();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadIndicators = useCallback(async () => {
    if (!user || !caseId) return;

    setLoading(true);
    setError(null);

    try {
      const indicatorsQuery = query(
        collection(db, 'cases', caseId, 'indicators'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(indicatorsQuery);
      const loadedIndicators = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setIndicators(loadedIndicators);
    } catch (err) {
      console.error('Error loading indicators:', err);
      setError('Failed to load indicators. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, caseId]);

  useEffect(() => {
    if (caseId) {
      loadIndicators();
    } else {
      setIndicators([]);
    }
  }, [caseId, loadIndicators]);

  const addIndicator = useCallback(async (indicatorData) => {
    if (!user || !caseId) throw new Error('User must be authenticated and a case must be selected to add an indicator');

    setLoading(true);
    setError(null);

    try {
      const newIndicator = {
        ...indicatorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid
      };

      const docRef = await addDoc(collection(db, 'cases', caseId, 'indicators'), newIndicator);
      const addedIndicator = { id: docRef.id, ...newIndicator, createdAt: new Date(), updatedAt: new Date() };
      
      setIndicators(prevIndicators => [addedIndicator, ...prevIndicators]);
      return addedIndicator;
    } catch (err) {
      console.error('Error adding indicator:', err);
      setError('Failed to add indicator. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, caseId]);

  const updateIndicator = useCallback(async (indicatorId, updates) => {
    if (!user || !caseId) throw new Error('User must be authenticated and a case must be selected to update an indicator');

    setLoading(true);
    setError(null);

    try {
      const indicatorRef = doc(db, 'cases', caseId, 'indicators', indicatorId);
      await updateDoc(indicatorRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      setIndicators(prevIndicators => 
        prevIndicators.map(indicator => 
          indicator.id === indicatorId ? { ...indicator, ...updates, updatedAt: new Date() } : indicator
        )
      );
    } catch (err) {
      console.error('Error updating indicator:', err);
      setError('Failed to update indicator. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, caseId]);

  const removeIndicator = useCallback(async (indicatorId) => {
    if (!user || !caseId) throw new Error('User must be authenticated and a case must be selected to remove an indicator');

    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'cases', caseId, 'indicators', indicatorId));
      setIndicators(prevIndicators => prevIndicators.filter(indicator => indicator.id !== indicatorId));
    } catch (err) {
      console.error('Error removing indicator:', err);
      setError('Failed to remove indicator. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, caseId]);

  const getIndicatorsByType = useCallback((type) => {
    return indicators.filter(indicator => indicator.type === type);
  }, [indicators]);

  const positiveIndicators = useMemo(() => getIndicatorsByType('positive'), [getIndicatorsByType]);
  const negativeIndicators = useMemo(() => getIndicatorsByType('negative'), [getIndicatorsByType]);

  return {
    indicators,
    positiveIndicators,
    negativeIndicators,
    loading,
    error,
    addIndicator,
    updateIndicator,
    removeIndicator,
    loadIndicators
  };
};
