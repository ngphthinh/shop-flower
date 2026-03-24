import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
      // Lưu vào localStorage
      localStorage.setItem("auth", JSON.stringify({ user, token, role }));
      // Đồng bộ một số key khác mà các service khác có thể dùng
      try {
        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        // ignore storage errors
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      // Xóa khỏi localStorage
      localStorage.removeItem("auth");
    },
    setUser: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
    },
    // Restore auth từ localStorage khi app load
    restoreAuth: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, setUser, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
