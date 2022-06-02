import { Photo } from "./photo";

export class Album {
    type: string;
    id: string;
    title: string;
    url: string;
    photos: Photo[];
    constructor (data?: Partial<Album>) {
        if (data) Object.assign(this, data);
        this.type = "Album";
        this.photos = [];
    }
            
}
