import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategoryId: null,
  selectedCategoryName: null,
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.selectedCategoryId = action.payload.id;
      state.selectedCategoryName = action.payload.name;
    },
    clearCategoryFilter: (state) => {
      state.selectedCategoryId = null;
      state.selectedCategoryName = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
  },
});

export const {
  setCategoryFilter,
  clearCategoryFilter,
  setSearchQuery,
  clearSearchQuery,
} = filterSlice.actions;
export default filterSlice.reducer;
