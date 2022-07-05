import { Photo } from "./photo";

export interface Album {
    id: string;
    title: string;
    url: string;
    photos: Photo[];        
}
