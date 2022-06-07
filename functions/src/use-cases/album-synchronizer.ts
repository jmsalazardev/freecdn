import fs from "fs";
import {Service, Inject} from "typedi";
import {lookup} from "mime-types";
import {
  AlbumService,
  AlbumBucketService,
} from "../services";
import {Logger} from "../interfaces";
import {canUserWriteAlbum, isValidUser} from "../validators";
import {UserService} from "../services/user-service";
import {AlbumNotFoundException, UserNotFoundException} from "../exceptions";
import {extractAlbum} from "gphotos-scraper";

@Service()
export class AlbumSynchronizer {
  @Inject("Logger")
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly albumService: AlbumService,
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

    const gAlbum = await extractAlbum(`https://photos.app.goo.gl/${input.albumId}`);
    if (!gAlbum) throw new AlbumNotFoundException();

    const {id: albumId, url, title} = gAlbum;

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

    const jsonString = JSON.stringify(gAlbum);
    const filename = `/tmp/${gAlbum.id}.json`;
    fs.writeFileSync(filename, jsonString);

    await this.bucket.uploadFile(filename, `${gAlbum.id}.json`, {
      contentType: "application/json",
    });

    await fs.unlinkSync(filename);
  }
}
