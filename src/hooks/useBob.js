/**
 * useBob Hook
 * 
 * Custom React hook for interacting with IBM Bob AI through the backend API.
 * This is the primary interface for all Bob-powered features in the frontend.
 * 
 * Features:
 * - Code Onboarder: Analyze repositories and generate onboarding docs
 * - Doc Generator: Create documentation and tests for code
 * - Task Automator: Perform code transformations
 * 
 * Usage:
 * const { onboard, document, automate, loading, error } = useBob();
 * const result = await onboard({ repoUrl: 'https://github.com/...' });
 */

import { useState } from 'react';
import axios from 'axios';
import { getSession } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Custom hook for IBM Bob interactions
 */
export function useBob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get authorization headers with Supabase JWT
   */
  const getAuthHeaders = async () => {
    const { session } = await getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  /**
   * Code Onboarder - Analyze a codebase and generate onboarding documentation
   * 
   * @param {Object} params
   * @param {string} params.repoUrl - GitHub repository URL (optional)
   * @param {string} params.zipContent - Base64 encoded ZIP file (optional)
   * @param {Object} params.fileStructure - File structure object (optional)
   * @returns {Promise<Object>} Bob's analysis including summary, getting started guide, key files, and architecture
   */
  const onboard = async ({ repoUrl, zipContent, fileStructure }) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/api/bob/onboard`,
        { repoUrl, zipContent, fileStructure },
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to analyze codebase';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Documentation Generator - Generate docs, comments, and tests for code
   * 
   * @param {Object} params
   * @param {string} params.code - Code to document
   * @param {string} params.language - Programming language (default: 'javascript')
   * @returns {Promise<Object>} Bob's documentation including JSDoc, README, tests, and edge cases
   */
  const document = async ({ code, language = 'javascript' }) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/api/bob/document`,
        { code, language },
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate documentation';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Task Automator - Perform code transformations based on natural language
   *
   * @param {Object} params
   * @param {string} params.task - Natural language description of the task
   * @param {string} params.code - Code to transform
   * @param {string} params.taskType - Type of task (refactor, convert, optimize, modernize)
   * @param {string} params.context - Additional context (optional)
   * @returns {Promise<Object>} Bob's transformation result with explanation
   */
  const automate = async ({ task, code, taskType = 'refactor', context }) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/api/bob/automate`,
        { task, code, taskType, context },
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to automate task';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Clear any existing errors
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // Methods
    onboard,
    document,
    automate,
    clearError,
    
    // State
    loading,
    error,
  };
}

/**
 * Hook for fetching Bob session history and metrics
 */
export function useBobSessions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = async () => {
    const { session } = await getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  /**
   * Get user's Bob session history
   * @param {Object} params
   * @param {number} params.limit - Number of sessions to fetch
   * @param {number} params.offset - Offset for pagination
   * @param {string} params.feature - Filter by feature type
   */
  const getSessions = async ({ limit = 10, offset = 0, feature } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams({ limit, offset });
      if (feature) params.append('feature', feature);

      const response = await axios.get(
        `${API_BASE_URL}/api/sessions?${params}`,
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch sessions';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Get aggregated metrics for dashboard
   */
  const getMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/api/sessions/metrics/summary`,
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch metrics';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Get daily statistics
   * @param {number} days - Number of days to fetch
   */
  const getDailyStats = async (days = 7) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/api/sessions/stats/daily?days=${days}`,
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch daily stats';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    getSessions,
    getMetrics,
    getDailyStats,
    loading,
    error,
  };
}

/**
 * Hook for exporting Bob reports
 */
export function useBobExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = async () => {
    const { session } = await getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  /**
   * Export full Bob report as JSON
   */
  const exportReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/api/export/report`,
        { headers }
      );

      // Trigger download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bob-report.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export report';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Get report summary without downloading
   */
  const getReportSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/api/export/report/summary`,
        { headers }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch report summary';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    exportReport,
    getReportSummary,
    loading,
    error,
  };
}

export default useBob;

// Made with Bob
