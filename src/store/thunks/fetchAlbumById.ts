import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Album } from '../../models/album';
import { appConfig } from '../../config';

export const fetchAlbumById = createAsyncThunk(
  'fetchAlbumById',
  async (albumId: string): Promise<Album> => {
    const { storageUrl } = appConfig;
    const storage = getStorage();
    const pathReference = ref(storage, `${storageUrl}/albums/${albumId}.json`);
    const url = await getDownloadURL(pathReference);
    const response = await fetch(url);
    return (await response.json()) as Album;
  }
);
