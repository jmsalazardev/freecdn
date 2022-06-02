import {Service, Inject} from "typedi";
import {SavePhotoInput} from "../interfaces/save-photo-input";
import {Photo} from "../models/Photo";
import {PhotoRepository} from "../repositories";

@Service()
export class PhotoService {
  @Inject("PhotoRepository")
  private readonly repository: PhotoRepository;

  async getPhotosByIds(ids: string[]): Promise<Photo[]> {
    return this.repository.findByIds(ids);
  }

  async getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
    return this.repository.findByAlbumId(albumId);
  }

  async getPhoto(id: string): Promise<Photo | null> {
    return this.repository.findById(id);
  }

  async createPhoto(photo: Photo): Promise<Photo | null> {
    return this.repository.create(photo);
  }

  async savePhoto(input: SavePhotoInput): Promise<Photo> {
    return this.repository.save(input);
  }

  async savePhotos(input: SavePhotoInput[]): Promise<void> {
    return this.repository.saveAll(input);
  }
}
