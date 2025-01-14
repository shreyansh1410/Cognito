import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
  id: string;
  title: string;
  content?: string;
  type: "document" | "tweet" | "video";
  tags: string[];
  date: string;
}

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [
    {
      id: "1",
      title: "Project Ideas",
      content:
        "Future Projects\n• Build a personal knowledge base\n• Create a habit tracker\n• Design a minimalist todo app",
      type: "document",
      tags: ["productivity", "ideas"],
      date: "10/03/2024",
    },
    {
      id: "2",
      title: "How to Build a Second Brain",
      type: "video",
      tags: ["productivity", "learning"],
      date: "09/03/2024",
    },
    {
      id: "3",
      title: "Productivity Tip",
      content:
        "The best way to learn is to build in public. Share your progress, get feedback, and help others along the way.",
      type: "tweet",
      tags: ["productivity", "learning"],
      date: "08/03/2024",
    },
  ],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
  },
});

export const { deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
