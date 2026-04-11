import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user;
      state.role = role;
      state.token = token || null;
      state.isAuthenticated = true;
      // Lưu vào localStorage
      localStorage.setItem("auth", JSON.stringify({ user, role, token }));
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      // Xóa khỏi localStorage
      localStorage.removeItem("auth");
    },
    // Restore auth từ localStorage khi app load
    restoreAuth: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user;
      state.role = role;
      state.token = token || null;
      state.isAuthenticated = true;
    },
    // Update user information without requiring full re-login
    setUser: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user;
      if (role !== undefined) state.role = role;
      if (token !== undefined) state.token = token;
      state.isAuthenticated = !!user;
    },
  },
});

export const { login, logout, restoreAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
