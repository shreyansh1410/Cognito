// contentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Content {
  id: string;
  type: string;
  title: string;
  link: string;
  tags: string[];
}

interface ContentState {
  items: Content[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  loading: "idle",
  error: null,
};

// Helper function to get the token (you can customize this if it's stored elsewhere)
const getAuthToken = () => localStorage.getItem("token");

export const fetchContents = createAsyncThunk(
  "content/fetchContents",
  async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = getAuthToken(); // Get the token from localStorage (or Redux)
    const response = await fetch(`${backendUrl}/api/v1/content`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch contents");
    }
    return response.json();
  }
);

export const addContent = createAsyncThunk(
  "content/addContent",
  async (content: Omit<Content, "id">) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = getAuthToken(); // Get the token from localStorage (or Redux)
    const response = await fetch(`${backendUrl}/api/v1/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error("Failed to add content");
    }
    return response.json();
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchContents.fulfilled,
        (state, action: PayloadAction<Content[]>) => {
          state.loading = "succeeded";
          state.items = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch contents";
      })
      .addCase(
        addContent.fulfilled,
        (state, action: PayloadAction<Content>) => {
          state.items.push(action.payload);
        }
      );
  },
});

export default contentSlice.reducer;
