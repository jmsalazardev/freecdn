import {UserNotFoundException} from "../exceptions";
import {User} from "../models/User";

export const isValidUser = (user: User): boolean => {
  if (!user) {
    throw new UserNotFoundException();
  }
  return true;
};
