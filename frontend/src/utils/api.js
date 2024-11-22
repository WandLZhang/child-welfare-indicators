// api.js

import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from './firebase'; // Assuming you have a firebase.js file for initialization

// Initialize Firebase Functions
const functions = getFunctions();

// Helper function to get the current user's ID token
const getIdToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }
  return await user.getIdToken();
};

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw new Error(error.response.data.message || 'An error occurred while processing your request');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received from the server. Please try again later');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('An error occurred while setting up the request');
  }
};

// API function to fetch documents based on a query
export const fetchDocuments = async (query) => {
  try {
    const idToken = await getIdToken();
    const fetchDocumentsFunction = httpsCallable(functions, 'fetchDocuments');
    const result = await fetchDocumentsFunction({ query, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to fetch analysis based on a query and template
export const fetchAnalysis = async (query, template) => {
  try {
    const idToken = await getIdToken();
    const fetchAnalysisFunction = httpsCallable(functions, 'fetchAnalysis');
    const result = await fetchAnalysisFunction({ query, template, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to generate a sample case
export const generateSampleCase = async () => {
  try {
    const generateSampleCaseFunction = httpsCallable(functions, 'generateSampleCase');
    const result = await generateSampleCaseFunction();
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to save a new template or update an existing one
export const saveTemplate = async (template) => {
  try {
    const idToken = await getIdToken();
    const saveTemplateFunction = httpsCallable(functions, 'saveTemplate');
    const result = await saveTemplateFunction({ template, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to fetch all saved templates
export const fetchTemplates = async () => {
  try {
    const idToken = await getIdToken();
    const fetchTemplatesFunction = httpsCallable(functions, 'fetchTemplates');
    const result = await fetchTemplatesFunction({ idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to delete a template
export const deleteTemplate = async (templateId) => {
  try {
    const idToken = await getIdToken();
    const deleteTemplateFunction = httpsCallable(functions, 'deleteTemplate');
    await deleteTemplateFunction({ templateId, idToken });
  } catch (error) {
    handleApiError(error);
  }
};

// API function to extract indicators from a case narrative
export const extractIndicators = async (caseNarrative) => {
  try {
    const idToken = await getIdToken();
    const extractIndicatorsFunction = httpsCallable(functions, 'extractIndicators');
    const result = await extractIndicatorsFunction({ caseNarrative, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to submit indicators to BigQuery
export const submitToBigQuery = async (indicators) => {
  try {
    const idToken = await getIdToken();
    const submitToBigQueryFunction = httpsCallable(functions, 'submitToBigQuery');
    const result = await submitToBigQueryFunction({ indicators, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to fetch case history
export const fetchCaseHistory = async (userId) => {
  try {
    const idToken = await getIdToken();
    const fetchCaseHistoryFunction = httpsCallable(functions, 'fetchCaseHistory');
    const result = await fetchCaseHistoryFunction({ userId, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

// API function to update user profile
export const updateUserProfile = async (updates) => {
  try {
    const idToken = await getIdToken();
    const updateUserProfileFunction = httpsCallable(functions, 'updateUserProfile');
    const result = await updateUserProfileFunction({ updates, idToken });
    return result.data;
  } catch (error) {
    handleApiError(error);
  }
};

export default {
  fetchDocuments,
  fetchAnalysis,
  generateSampleCase,
  saveTemplate,
  fetchTemplates,
  deleteTemplate,
  extractIndicators,
  submitToBigQuery,
  fetchCaseHistory,
  updateUserProfile
};
