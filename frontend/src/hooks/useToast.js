// src/hooks/useToast.js

import { useState, useCallback, useRef, useEffect } from 'react';

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const useToast = (defaultDuration = 3000) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = defaultDuration) => {
    const id = toastIdCounter.current++;
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, [defaultDuration]);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts(prevToasts => prevToasts.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  useEffect(() => {
    const timeouts = toasts.map(toast => {
      return setTimeout(() => removeToast(toast.id), toast.duration);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [toasts, removeToast]);

  const showToast = useCallback((message, type = TOAST_TYPES.INFO) => {
    return addToast(message, type);
  }, [addToast]);

  const showSuccessToast = useCallback((message) => {
    return addToast(message, TOAST_TYPES.SUCCESS);
  }, [addToast]);

  const showErrorToast = useCallback((message) => {
    return addToast(message, TOAST_TYPES.ERROR);
  }, [addToast]);

  const showWarningToast = useCallback((message) => {
    return addToast(message, TOAST_TYPES.WARNING);
  }, [addToast]);

  return {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    removeToast,
    updateToast,
  };
};
