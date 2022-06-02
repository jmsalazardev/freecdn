import {
  Firestore,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  writeBatch,
} from "firebase/firestore";
import {Inject, Service} from "typedi";
import {Photo} from "../models/Photo";
import {PhotoRepository} from "./photo-repository";

@Service()
export class PhotoFirebase implements PhotoRepository {
  constructor(@Inject("Firestore") private readonly db: Firestore) {}

  async findByIds(ids: string[]): Promise<Photo[]> {
    const q = query(
        collection(this.db, "photos"),
        where("id", "in", ids),
    );

    const querySnapshot = await getDocs(q);
    const photos = querySnapshot.docs.map((doc) => doc.data());
    return photos as Photo[];
  }

  async findByAlbumId(albumId: string): Promise<Photo[]> {
    const q = query(
        collection(this.db, "photos"),
        where("albumId", "==", albumId),
    );

    const querySnapshot = await getDocs(q);
    const photos = querySnapshot.docs.map((doc) => doc.data());
    return photos as Photo[];
  }

  async findById(id: string): Promise<Photo | null> {
    const snap = await getDoc(doc(this.db, "photos", id));
    if (snap.exists()) return snap.data() as Photo;

    return null;
  }

  async create(photo: Photo): Promise<Photo | null> {
    const ref = doc(this.db, "photos", photo.id);

    const data = await setDoc(ref, photo);
    return data as unknown as Photo;
  }

  async saveAll(photos: Photo[]): Promise<void> {
    const batch = writeBatch(this.db);
    photos.forEach((photo) => {
      const {
        id,
        albumId,
        name,
        mimeType,
        description,
        size,
        width,
        height,
        url,
        createdAt,
      } = photo;

      const photoRef = doc(this.db, "photos", id);
      const albumRef = doc(this.db, `albums/${albumId}`);

      batch.set(photoRef, {
        id,
        albumRef,
        name,
        mimeType,
        description,
        size,
        width,
        height,
        url,
        createdAt,
      });
    });
    await batch.commit();
  }

  async save(photo: Photo): Promise<Photo> {
    const {
      id,
      albumId,
      name,
      mimeType,
      description,
      size,
      width,
      height,
      url,
      createdAt,
    } = photo;
    const ref = doc(this.db, "photos", id);
    const albumRef = doc(this.db, `albums/${albumId}`);
    await setDoc(ref, {
      id,
      albumRef,
      name,
      mimeType,
      description,
      size,
      width,
      height,
      url,
      createdAt,
    });
    return photo;
  }
}
