import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isSidebarCollapsed: boolean;
}

const initialState: UIState = {
  isSidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
