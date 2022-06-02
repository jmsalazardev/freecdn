export class ForbiddenException extends Error {
    code: 403;
    message = "Forbidden";
}
