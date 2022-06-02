import {ForbiddenException} from "../exceptions";
import {Album} from "../models";
import {User} from "../models/User";

export const canUserWriteAlbum = (user: User, album: Album): boolean => {
  if (album.owner !== user.id) {
    throw new ForbiddenException(
        "You don't have permission to access to this album"
    );
  }
  return true;
};
