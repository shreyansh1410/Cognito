import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isSidebarCollapsed: boolean;
  isAddContentModalOpen: boolean;
}

const initialState: UIState = {
  isSidebarCollapsed: false,
  isAddContentModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    openAddContentModal: (state) => {
      state.isAddContentModalOpen = true;
    },
    closeAddContentModal: (state) => {
      state.isAddContentModalOpen = false;
    },
  },
});

export const { toggleSidebar, openAddContentModal, closeAddContentModal } =
  uiSlice.actions;
export default uiSlice.reducer;
