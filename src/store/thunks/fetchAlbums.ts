import { collection, query, getDocs, where } from "firebase/firestore";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../services/firebase';
import { getCurrentUser } from '../../services/auth-service';
import { Album } from "../../models/album";
import { fromFirestore } from "../mappers/album-mapper";

export const fetchAlbums = createAsyncThunk(
    'albums',
    async (): Promise<Album[]> => {
        const currentUser = getCurrentUser();
        const albumsRef = collection(db, "albums");
        const q = query(
            albumsRef,
            where("owner", "==", currentUser?.uid),
            // orderBy("title", "asc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(fromFirestore).sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
        
    },
);
