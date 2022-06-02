import { combineReducers } from 'redux';
import { albumsSlice, photosSlice } from '../slices';

const rootReducer = combineReducers({
  albums: albumsSlice.reducer,
  photos: photosSlice.reducer,
});



export default rootReducer;
