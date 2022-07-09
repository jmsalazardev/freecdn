import { createAsyncThunk } from '@reduxjs/toolkit';
import { appConfig } from '../../config';
import { getCurrentUser } from '../../services/auth-service';

export const addAlbum = createAsyncThunk(
  'addAlbum',
  async (id: string): Promise<void> => {
    const currentUser = getCurrentUser();
    const url = `${appConfig.apiUrl}/sync`;
    const params = new URLSearchParams({ id, uid: currentUser.uid });
    await fetch(`${url}?${params}`, { mode: 'no-cors' });
  }
);
