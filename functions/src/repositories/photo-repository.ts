import {Photo} from "../models/Photo";

export interface PhotoRepository {
  findByIds(ids: string[]): Promise<Photo[]>;
  findByAlbumId(albumId: string): Promise<Photo[]>;
  findById(id: string): Promise<Photo | null>;
  create(photo: Photo): Promise<Photo | null>;
  save(photo: Photo): Promise<Photo>;
  saveAll(photos: Photo[]): Promise<void>;
}
