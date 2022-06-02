import {Service, Inject} from "typedi";
import {User} from "../models/User";
import {UserRepository} from "../repositories";


@Service()
export class UserService {
  @Inject("UserRepository")
  private readonly repository: UserRepository;

  async getUser(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }
}
