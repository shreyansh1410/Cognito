import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// Check localStorage for saved user data when initializing the state
const storedUserData = localStorage.getItem("user");
const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: parsedUserData
    ? { isAuthenticated: true, user: parsedUserData }
    : initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      // Remove user data from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
