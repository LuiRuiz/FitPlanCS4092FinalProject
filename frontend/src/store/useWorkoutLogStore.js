import { create } from 'zustand';
import axios from 'axios';

const API_BASE = "http://localhost:5000"

const useWorkoutLogStore = create((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchWorkoutLogs: async (event_id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE}/api/workoutlogs/getworkoutlogs`,
        {
          params: { event_id },
        }
      );

      if (response.data.success) {
        set({ logs: response.data.data, isLoading: false });
      } else {
        set({
          error: response.data.message || 'Failed to fetch logs',
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('Error fetching workout logs:', err);
      set({
        error: err.message || 'Something went wrong',
        isLoading: false,
      });
    }
  },

  updateWorkoutLog: async (id, { reps, sets, weight }) => {
    try {
      const response = await axios.put(`${API_BASE}/api/workoutlogs/updateworkoutlog/${id}`, {
        reps: parseInt(reps, 10),
        sets: parseInt(sets, 10),
        weight: parseFloat(weight),
      });

      return response.data.success;
    } catch (err) {
      console.error(`Error updating log ${id}:`, err);
      return false;
    }
  },

  clearLogs: () => {
    set({ logs: [], error: null });
  },
}));

export default useWorkoutLogStore;