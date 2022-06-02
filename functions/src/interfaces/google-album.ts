import {GoogleAlbumItem} from "./google-album-item";

export interface GoogleAlbum {
  id: string;
  key: string;
  title: string;
  url: string;
  items: GoogleAlbumItem[];
}
