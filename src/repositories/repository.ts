import { serializeResponse } from "../apis/apiHelper";
import { Repository } from "../models/repository";

export interface RepositoryRepository {
  getUserRepositories(
    username: string,
    perPage?: number
  ): Promise<Repository[]>;
}

class RealRepositoryRepository implements RepositoryRepository {
  async getUserRepositories(username: string, perPage: number) {
    return fetch(
      `https://api.github.com/users/${username}/repos${
        perPage ? `?per_page=${perPage}` : ""
      }`
    ).then(serializeResponse<Repository[]>());
  }
}

export const NewRepositoryRepository: () => RepositoryRepository = () =>
  new RealRepositoryRepository();

export default RepositoryRepository;
