import { createSlice } from '@reduxjs/toolkit';
import { PhotosState } from '../../common/interfaces';
import { fetchPhotosByAlbumId } from '../thunks';

const initialState = {
  photos: [],
  error: null,
  status: 'idle',
} as PhotosState;

export const photosSlice = createSlice({
  name: 'fetchPhotosByAlbumId',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchPhotosByAlbumId.pending, (state: PhotosState) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPhotosByAlbumId.fulfilled, (state: any, action: any) => {
        state.status = 'succeeded';
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(fetchPhotosByAlbumId.rejected, (state: any, action: any) => {
        state.state = 'failed';
        state.error = action.error.message;
      });
  },
});
