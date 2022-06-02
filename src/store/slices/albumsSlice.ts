import { createSlice } from '@reduxjs/toolkit';
import { AlbumsState } from '../../common/interfaces';
import { fetchAlbums } from "../thunks"

const initialState = {
  albums: [],
  error: null,
  status: 'idle',
} as AlbumsState;

export const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAlbums.pending, (state: AlbumsState) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state: AlbumsState, action: {payload: []}) => {
        state.status = 'succeeded';
        state.error = null;
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state: AlbumsState, action: any) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
