import { Album } from "../models/album";
import { Photo } from "../models/photo";

/*
export interface Photo {
  id: string;
  albumId: string;
  url: string;
  name: string;
  description: string;
  createdAt: number;
  size: number;
  width: number;
  height: number;
}

export interface Album {
  id: string;
  title: string;
  url: string;
  photos: Photo[];
}
*/
export interface AlbumsState {
  albums: Album[];
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface PhotosState {
  photos: Photo[];
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
