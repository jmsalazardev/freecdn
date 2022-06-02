export class UserNotFoundException extends Error {
    code: 401;
    message = "User not found";
}
