import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Topic {
  id: string;
  title: str; // intentionally typo to be fixed later if needed, wait no.
  title: string;
  description: string | null;
  tags: string[];
  gradient_color: string;
  icon_name: string;
  created_at: string;
}

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  loading: false,
  error: null,
};

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async () => {
  const response = await fetch('http://localhost:8000/api/v1/topics/', {
    headers: {
      // Cookies will be sent automatically by browser if withCredentials is true, or we let proxy handle it
    },
  });
  if (!response.ok) throw new Error('Failed to fetch topics');
  return response.json();
});

export const createTopic = createAsyncThunk('topics/createTopic', async (topicData: Partial<Topic>) => {
  const response = await fetch('http://localhost:8000/api/v1/topics/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topicData),
  });
  if (!response.ok) throw new Error('Failed to create topic');
  return response.json();
});

export const deleteTopic = createAsyncThunk('topics/deleteTopic', async (topicId: string) => {
  const response = await fetch(`http://localhost:8000/api/v1/topics/${topicId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete topic');
  return topicId;
});

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => { state.loading = true; })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.unshift(action.payload);
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topics = state.topics.filter(t => t.id !== action.payload);
      });
  },
});

export default topicSlice.reducer;
