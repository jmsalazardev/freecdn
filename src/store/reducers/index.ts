import { combineReducers } from 'redux';
import { albumsSlice, photosSlice, albumByIdSlice } from '../slices';

const rootReducer = combineReducers({
  albums: albumsSlice.reducer,
  photos: photosSlice.reducer,
  albumById: albumByIdSlice.reducer,
});



export default rootReducer;
