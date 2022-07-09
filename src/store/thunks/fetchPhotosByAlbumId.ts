import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Photo } from '../../models/photo';
import { appConfig } from '../../config';

export const fetchPhotosByAlbumId = createAsyncThunk(
  'fetchPhotosByAlbumId',
  async (albumId: string): Promise<Photo[]> => {
    const { storageUrl } = appConfig;
    const storage = getStorage();
    const pathReference = ref(storage, `${storageUrl}/albums/${albumId}.json`);
    const url = await getDownloadURL(pathReference);
    const response = await fetch(url);
    const data = (await response.json()) as any;
    return data.photos;
  }
);
