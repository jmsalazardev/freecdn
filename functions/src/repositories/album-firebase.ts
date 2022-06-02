import {Firestore} from "@google-cloud/firestore";
import {Inject, Service} from "typedi";
import {Album} from "../models";
import {AlbumRepository} from "./album-repository";

@Service()
export class AlbumFirebase implements AlbumRepository {
  constructor(@Inject("Firestore") private readonly db: Firestore) {
  }

  async findById(id: string): Promise<Album | null> {
    const snap = await this.db.collection("albums").doc(id).get();
    if (snap.exists) return snap.data() as Album;
    return null;
  }

  async create(album: Album): Promise<void> {
    const {id, title, url, owner} = album;
    await this.db.collection("albums").doc(id).create({title, url, owner});
  }

  async update(id: string, data: Partial<Album>): Promise<void> {
    await this.db.collection("albums").doc(id).update(data);
  }
}
