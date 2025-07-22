import { Repository } from "../models/repository";
import RepositoryRepository from "../repositories/repository";

interface RepositoryUsecase {
  repositoryRepo: RepositoryRepository;

  getUserRepos: (username: string, perPage?: number) => Promise<Repository[]>;
}

class RealRepositoryUsecase implements RepositoryUsecase {
  repositoryRepo: RepositoryRepository;

  constructor(repositoryRepo: RepositoryRepository) {
    this.repositoryRepo = repositoryRepo;
  }

  async getUserRepos(username: string, perPage?: number) {
    const resp = await this.repositoryRepo.getUserRepositories(
      username,
      perPage
    );

    return resp;
  }
}

export const NewRepositoryUsecase: (
  repositoryRepository: RepositoryRepository
) => RepositoryUsecase = (repositoryRepository) =>
  new RealRepositoryUsecase(repositoryRepository);

export default RepositoryUsecase;
