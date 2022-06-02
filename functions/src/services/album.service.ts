import {Inject, Service} from "typedi";
import { Logger } from "../interfaces";
import {Album} from "../models/Album";
import {AlbumRepository} from "../repositories";

type CreateAlbumInput = Pick<Album, "id" | "title" | "url" | "owner">;
type UpdateAlbumInput = Pick<Album, "id" | "title">;

@Service()
export class AlbumService {
  @Inject("Logger")
  private readonly logger: Logger;

  @Inject("AlbumRepository")
  private readonly repository: AlbumRepository;

  async getAlbum(id: string): Promise<Album | null> {
    return this.repository.findById(id);
  }

  async createAlbum(input: CreateAlbumInput): Promise<void> {
    return this.repository.create(input);
  }

  async updateAlbum(input: UpdateAlbumInput): Promise<void> {
    const {id} = input;
    this.repository.update(id, input);
  }
}
