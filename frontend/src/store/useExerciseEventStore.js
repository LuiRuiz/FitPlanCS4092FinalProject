import { create } from 'zustand';
import axios from 'axios';

const API_BASE = "http://localhost:5000";

const useExerciseEventStore = create((set, get) => ({
    monthlyEvents: [],
    upcomingEvents: [],
    loading: false,
    error: null,

    fetchUpcomingEvents: async (userID) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_BASE}/api/exerciseEvent/upcoming`, {
                params: { userID },
            });
            set({ upcomingEvents: res.data.events, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchMonthlyEvents: async (userID) => {
        set({ isLoading: true, error: null });
        try {
            //const userID = localStorage.getItem('userID');
            const response = await axios.get(`${API_BASE}/api/exerciseEvent/monthly`, {
                params: { userID },
            });
            //console.log("LOOK HERE", response.data)

            const formattedEvents = response.data.events.map((event) => ({
                id: event.id,
                title: event.exercise_group,
                start: event.date,
                end: event.date,
            }));
            //console.log("Now_Look HERE", formattedEvents)

            set({ monthlyEvents: formattedEvents, isLoading: false });
            //console.log(formattedEvents);
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    createEvents: async (userID, count) => {
        //const userID = localStorage.getItem('userID');
        if (!userID) return set({ error: 'User ID not found in localStorage' });

        set({ loading: true });
        try {
            await axios.post(`${API_BASE}/api/exerciseEvent/createEvents`, { userID, count });
            await get().fetchMonthlyEvents(); // Refresh state
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
}));

export default useExerciseEventStore;