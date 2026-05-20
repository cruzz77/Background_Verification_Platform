import { create } from 'zustand';
import api from '../services/api';
import { Candidate, DashboardStats } from '../types';

interface CandidateState {
  candidates: Candidate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentCandidate: Candidate | null;
  dashboardStats: DashboardStats;
  loading: boolean;
  error: string | null;
  
  fetchCandidates: (params?: { page?: number; limit?: number; search?: string; status?: string }) => Promise<void>;
  fetchCandidate: (id: string) => Promise<void>;
  createCandidate: (data: any) => Promise<Candidate>;
  updateCandidate: (id: string, data: any) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  startVerification: (id: string) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  clearCurrentCandidate: () => void;
}

const initialStats: DashboardStats = {
  total: 0,
  verified: 0,
  failed: 0,
  partial: 0,
  pending: 0,
};

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  currentCandidate: null,
  dashboardStats: initialStats,
  loading: false,
  error: null,

  fetchCandidates: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/candidates', { params });
      const { candidates, pagination } = response.data.data;
      set({ candidates, pagination, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch candidates.' 
      });
    }
  },

  fetchCandidate: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/candidates/${id}`);
      set({ currentCandidate: response.data.data.candidate, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch candidate details.' 
      });
    }
  },

  createCandidate: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/candidates', data);
      const newCandidate = response.data.data.candidate;
      set((state) => ({ 
        candidates: [newCandidate, ...state.candidates], 
        loading: false 
      }));
      // Refresh statistics in background
      get().fetchDashboardStats();
      return newCandidate;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to create candidate.' 
      });
      throw error;
    }
  },

  updateCandidate: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/candidates/${id}`, data);
      const updatedCandidate = response.data.data.candidate;
      set((state) => ({
        candidates: state.candidates.map((c) => (c.id === id ? updatedCandidate : c)),
        currentCandidate: state.currentCandidate?.id === id ? updatedCandidate : state.currentCandidate,
        loading: false,
      }));
      get().fetchDashboardStats();
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to update candidate.' 
      });
      throw error;
    }
  },

  deleteCandidate: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/candidates/${id}`);
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== id),
        currentCandidate: state.currentCandidate?.id === id ? null : state.currentCandidate,
        loading: false,
      }));
      get().fetchDashboardStats();
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to delete candidate.' 
      });
      throw error;
    }
  },

  startVerification: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/verifications/${id}/start`);
      const { candidate } = response.data.data;
      
      // Update local state
      set((state) => ({
        candidates: state.candidates.map((c) => (c.id === id ? candidate : c)),
        currentCandidate: state.currentCandidate?.id === id ? { ...state.currentCandidate, ...candidate } : state.currentCandidate,
        loading: false,
      }));
      
      // Reload specific candidate details to get logs/reports
      await get().fetchCandidate(id);
      get().fetchDashboardStats();
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Verification pipeline execution failed.' 
      });
      throw error;
    }
  },

  fetchDashboardStats: async () => {
    try {
      // Fetch all candidate records for metrics calculations
      const response = await api.get('/candidates', { params: { limit: 1000 } });
      const candidatesList: Candidate[] = response.data.data.candidates;
      
      const stats: DashboardStats = {
        total: candidatesList.length,
        verified: candidatesList.filter((c) => c.status === 'VERIFIED').length,
        failed: candidatesList.filter((c) => c.status === 'FAILED').length,
        partial: candidatesList.filter((c) => c.status === 'PARTIAL').length,
        pending: candidatesList.filter((c) => c.status === 'PENDING').length,
      };

      set({ dashboardStats: stats });
    } catch (error) {
      console.error('[Store] Error aggregating dashboard stats:', error);
    }
  },

  clearCurrentCandidate: () => set({ currentCandidate: null }),
}));
