import { createSlice } from '@reduxjs/toolkit';
import { AlbumState } from '../../common/interfaces';
import { fetchAlbumById } from '../thunks';
import { Album } from '../../models';

const initialState = {
  album: null,
  error: null,
  status: 'idle',
} as AlbumState;

export const albumByIdSlice = createSlice({
  name: 'fetchAlbumById',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAlbumById.pending, (state: AlbumState) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchAlbumById.fulfilled,
        (state: AlbumState, action: { payload: Album | null }) => {
          state.status = 'succeeded';
          state.error = null;
          state.album = action.payload;
        }
      )
      .addCase(fetchAlbumById.rejected, (state: AlbumState, action: any) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
