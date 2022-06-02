import {User} from "../models/User";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
}
