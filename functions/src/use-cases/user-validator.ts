import {Service, Inject} from "typedi";
import {Logger} from "../interfaces";
import {UserService} from "../services/user-service";
import {ForbiddenException} from "../exceptions";

@Service()
export class UserValidator {
  @Inject("Logger")
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
  ) { }

  async execute(input: { id: string }): Promise<void> {
    this.logger.info("getting user data", input);
    const user = await this.userService.getUser(input.id);
    if (!user) throw new ForbiddenException("User not registered");
  }
}
