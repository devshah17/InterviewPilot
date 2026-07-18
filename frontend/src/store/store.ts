import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import topicReducer from './slices/topicSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
