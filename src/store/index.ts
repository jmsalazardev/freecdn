import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import reducers from './reducers';

export const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
