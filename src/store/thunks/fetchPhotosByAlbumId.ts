import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorage, ref,getDownloadURL } from "firebase/storage";
import { Photo } from '../../models/photo';

export const fetchPhotosByAlbumId = createAsyncThunk(
  'photos/fetchByAlbumId',
  async (albumId: string): Promise<Photo[]> => {
    const storage = getStorage();
    const pathReference = ref(storage, `gs://gphotos-cdn.appspot.com/cdn/albums/${albumId}.json`);
    const url = await getDownloadURL(pathReference);
    const response = await fetch(url);
    const data = await response.json() as any;
    return data.photos;
  },
);