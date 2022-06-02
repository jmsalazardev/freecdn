export class AlbumNotFoundException extends Error {
    code: 401;
    message = "Album not found";
}
