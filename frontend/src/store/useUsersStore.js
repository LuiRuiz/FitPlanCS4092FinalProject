import { create } from 'zustand';
import axios from 'axios';

const API_BASE = "http://localhost:5000";

const useUsersStore = create((set) => ({
  user: null,
  error: null,
  loading: false,

  // Register user and store userID
  registerUser: async (username, email) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE}/api/users/register`, {
        username,
        email,
      });

      const newUser = response.data.data;
      // Store user ID in localStorage
      localStorage.setItem('userID', newUser.id); 
      set({ user: newUser, loading: false });
    } catch (err) {
      console.error("Registration failed:", err);
      set({
        error: err.response?.data?.message || "Registration error",
        loading: false,
      });
    }
  },

  // Login user by email password not working yet
  loginUser: async (email) => {
    set({ loading: true, error: null });
    console.log("workingS");

    try {
      const response = await axios.post(`${API_BASE}/api/users/login`, { email });

      const foundUser = response.data.data;
      // Store user ID in localStorage
      localStorage.setItem('userID', foundUser.id); 
      set({ user: foundUser, loading: false });
    } catch (err) {
      console.error("Login failed:", err);
      set({
        error: err.response?.data?.message || "Login error",
        loading: false,
      });
    }
  },

  logoutUser: () => {
    localStorage.removeItem('userID');
    set({ user: null });
  },
}));

export default useUsersStore;