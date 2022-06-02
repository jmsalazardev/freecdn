import {UserRecord} from "firebase-admin/auth";
import {User} from "../models/User";


export const fromAuth = (data: UserRecord): User=> {
  const {uid} = data;
  return {id: uid} as User;
};
