import {Auth} from "firebase-admin/auth";
import {Inject, Service} from "typedi";
import {Logger} from "../interfaces";
import {fromAuth} from "../mappers/user-mapper";
import {User} from "../models/User";
import {UserRepository} from "./user-repository";

@Service()
export class UserFirebase implements UserRepository {
  @Inject("Logger")
  private readonly logger: Logger;

  constructor(
    @Inject("Auth") private readonly auth: Auth) {}

  async findById(id: string): Promise<User | null> {
    try {
      const data = await this.auth.getUser(id);
      if (data) return fromAuth(data);
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }
}
