import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { Photo } from '../../models/photo';

export const toFirestore = (photo: Photo) => {
  const { id, filename, url } = photo;
  return {
    id,
    filename,
    url,
  };
};

export const fromFirestore = (
  snapshot: QueryDocumentSnapshot,
  options?: SnapshotOptions
) => {
  const data = snapshot.data(options);
  return data;
};
