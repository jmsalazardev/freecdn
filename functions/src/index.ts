import "reflect-metadata";
import { logger, https, runWith } from "firebase-functions";
import { db, storage, auth } from "./services/firebase";
import { Container } from "typedi";
import { AlbumSynchronizer } from "./use-cases";
import { PhotoFirebase } from "./repositories/photo-firebase";
import { AlbumFirebase } from "./repositories/album-firebase";
import { UserFirebase } from "./repositories/user-firebase";
import { BadRequestException } from "./exceptions";

Container.set("Firestore", db);
Container.set("Auth", auth);
Container.set("AlbumBucket", storage.bucket("gs://gphotos-cdn.appspot.com"));
Container.set("Logger", logger);
Container.set("UserRepository", Container.get(UserFirebase));
Container.set("AlbumRepository", Container.get(AlbumFirebase));
Container.set("PhotoRepository", Container.get(PhotoFirebase));

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const test = https.onRequest(async (req, res) => {
  const { uid, id } = req.query;

  try {
    if (!uid || !id) throw new BadRequestException();

    

    res.status(200).json({
      code: 200,
      message: "OK",
    });
  } catch (error: unknown) {
    const { code, message } = error as {message: string, code: number};
    res.status(code || 500).json({
      code: code || 500,
      message,
    });
  }
});


export const sync = runWith({
  // memory: "1GB",
}).https.onRequest(async (req, res) => {
  const { uid, id } = req.query;

  try {
    if (!uid || !id) throw new BadRequestException();

    const albumSynchronizer = Container.get(AlbumSynchronizer);
    await albumSynchronizer.execute({ userId: `${uid}`, albumId: `${id}` });

    res.status(200).json({
      code: 200,
      message: "OK",
    });
  } catch (error: unknown) {
    const { code, message } = error as {message: string, code: number};
    console.log(error);
    res.status(500).json({
      code: code || 500,
      message,
    });
  }
});
