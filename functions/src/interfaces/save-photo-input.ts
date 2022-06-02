export interface SavePhotoInput {
    id: string;
    albumId: string;
    name: string;
    mimeType: string;
    description: string;
    size: number;
    width: number;
    height: number;
    url: string;
    createdAt: number
}
