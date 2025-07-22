import { User } from "../models/user";
import UserRepository from "../repositories/user";

interface UserUsecase {
  userRepo: UserRepository;
  searchUserByUsername: (username: string) => Promise<User>;
}

class RealUserUsecase implements UserUsecase {
  userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async searchUserByUsername(username: string) {
    const resp = await this.userRepo.getUserByUsername(username);
    return resp;
  }
}

export const NewUserUsecase: (userRepository: UserRepository) => UserUsecase = (
  userRepository
) => new RealUserUsecase(userRepository);

export default UserUsecase;
