import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, role } = action.payload;
      state.user = user;
      state.role = role;
      state.isAuthenticated = true;
      // Lưu vào localStorage
      localStorage.setItem("auth", JSON.stringify({ user, role }));
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      // Xóa khỏi localStorage
      localStorage.removeItem("auth");
    },
    // Restore auth từ localStorage khi app load
    restoreAuth: (state, action) => {
      const { user, role } = action.payload;
      state.user = user;
      state.role = role;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
