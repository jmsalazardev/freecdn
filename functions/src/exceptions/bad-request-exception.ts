export class BadRequestException extends Error {
    code: 400;
    message = "Bad Request";
}
