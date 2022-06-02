import fs from "fs";
import {Service, Inject} from "typedi";
import {lookup} from "mime-types";
import {
  AlbumService,
  GoogleAlbumService,
  AlbumBucketService,
} from "../services";
import {Logger} from "../interfaces";
import {Photo} from "../models";
import {canUserWriteAlbum, isValidUser} from "../validators";
import {UserService} from "../services/user-service";
import {AlbumNotFoundException, UserNotFoundException} from "../exceptions";

@Service()
export class AlbumSynchronizer {
  @Inject("Logger")
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly albumService: AlbumService,
    private readonly googleAlbumService: GoogleAlbumService,
    private readonly bucket: AlbumBucketService,
  ) { }

  async execute(input: {userId: string, albumId: string }): Promise<void> {
    console.log("input", input);
    this.logger.info("getting album data", input);

    const user = await this.userService.getUser(input.userId);
    if (!user) throw new UserNotFoundException();

    if (user && isValidUser(user)) this.logger.info("user validated");

    const album = await this.albumService.getAlbum(input.albumId);
    if (album && canUserWriteAlbum(user, album)) {
      this.logger.info("user is allowed to write on this album");
    }

    const gAlbum = await this.googleAlbumService.getAlbum(`https://photos.app.goo.gl/${input.albumId}`);
    if (!gAlbum) throw new AlbumNotFoundException();

    const {items: gPhotos, key, id: albumId, url, title} = gAlbum;

    if (album) {
      if (title !== album.title) {
        const input = {
          id: albumId,
          title,
        };
        this.logger.debug("updating album", input);
        await this.albumService.updateAlbum(input);
      }
    } else {
      const input = {
        id: albumId,
        url,
        title,
        owner: user.id,
      };
      this.logger.debug("creating album", input);
      await this.albumService.createAlbum(input);
    }

    const chunkSize = 500;
    const photos: Photo[] = [];
    for (let i = 0; i < gPhotos.length; i += chunkSize) {
      const chunk = gPhotos.slice(i, i + chunkSize);
      const ids = chunk.map((el) => el.id);
      const photosInfo = await this.googleAlbumService.getPhotosByIds(key, ids);

      photos.push(...photosInfo.map((el) => {
        const mimeType = `${lookup(el.filename)}`;
        const name = el.filename.replace(/\.[^/.]+$/, "");
        const found = gAlbum.items.find((item) => item.id === el.id);
        const url = found ? found.url : "";
        return {...el, mimeType, name, url, albumId};
      }));
    }

    photos.sort((a,b) => b.createdAt - a.createdAt);

    const jsonString = JSON.stringify({
      id: gAlbum.id,
      title: gAlbum.title,
      url: gAlbum.url,
      photos,
    });


    const filename = `/tmp/${gAlbum.id}.json`;
    fs.writeFileSync(filename, jsonString);

    await this.bucket.uploadFile(filename, `${gAlbum.id}.json`, {
      contentType: "application/json",
    });
    await fs.unlinkSync(filename);
  }
}
