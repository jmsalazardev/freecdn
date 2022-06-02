import {Album} from "../models";

export interface AlbumRepository {
  findById(id: string): Promise<Album | null>;
  create(album: Album): Promise<void>;
  update(id: string, album: Partial<Album>): Promise<void>;
}
