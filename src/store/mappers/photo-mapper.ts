import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Photo } from "../../models/photo";

export const toFirestore = (photo: Photo) => {
    const {id, name, url} = photo;
    return {
        id,
        name,
        url,
    };
};

export const fromFirestore = (snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) => {
    const data = snapshot.data(options);
    return data;
    
};

