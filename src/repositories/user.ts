import { serializeResponse } from "../apis/apiHelper";
import { User } from "../models/user";

export interface UserRepository {
  getUserByUsername(username: string): Promise<User>;
}

class RealUserRepository implements UserRepository {
  async getUserByUsername(username: string) {
    return fetch(`https://api.github.com/users/${username}`).then(
      serializeResponse<User>()
    );
  }
}

export const NewUserRepository: () => UserRepository = () =>
  new RealUserRepository();

export default UserRepository;
