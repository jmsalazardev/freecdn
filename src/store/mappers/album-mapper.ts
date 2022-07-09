import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Album } from '../../models/album';

export const toFirestore = (album: Album) => {
  const { id, title, url } = album;
  return {
    id,
    title,
    url,
  };
};

export const fromFirestore = (snapshot: QueryDocumentSnapshot): Album => {
  const { id } = snapshot;
  const data = snapshot.data();
  const { title, url } = data;
  return { id, title, url } as Album;
};

export const toModel = (data: any): Album => data;
