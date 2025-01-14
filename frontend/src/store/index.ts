import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notesSlice";
import uiReducer from "./uiSlice";
import authReducer from "./authSlice";
import contentReducer from "./contentSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    ui: uiReducer,
    auth: authReducer,
    content: contentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
