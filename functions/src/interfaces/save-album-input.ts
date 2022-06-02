export interface SaveAlbumInput {
    id: string;
    title: string;
    url: string;
    owner: string;
    photosId?: string[];
}
