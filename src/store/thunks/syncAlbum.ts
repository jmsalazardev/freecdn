import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPhotosByAlbumId } from './fetchPhotosByAlbumId';
import { appConfig } from '../../config'
import { getCurrentUser } from '../../services/auth-service';

export const syncAlbum = createAsyncThunk(
    'syncAlbum',
    async (id: string, thunkApi): Promise<void> => {
        const currentUser = getCurrentUser();
        const url = `${appConfig.apiUrl}/sync`;
        const params = new URLSearchParams({id, uid: currentUser.uid});
        await fetch(`${url}?${params}`, {mode: "no-cors"});
        thunkApi.dispatch(fetchPhotosByAlbumId(id));
    },
);
