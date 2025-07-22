import { NewRepositoryRepository } from "./repositories/repository";
import { NewUserRepository } from "./repositories/user";
import RepositoryUsecase, { NewRepositoryUsecase } from "./usecases/repository";
import UserUsecase, { NewUserUsecase } from "./usecases/user";

interface Usecases {
  user: UserUsecase;
  repository: RepositoryUsecase;
}

interface Dependencies {
  usecases: Usecases;
}

const userRepo = NewUserRepository();
const repositoryRepo = NewRepositoryRepository();

const userUsecase = NewUserUsecase(userRepo);
const repositoryUsecase = NewRepositoryUsecase(repositoryRepo);

const dependencies: Dependencies = {
  usecases: {
    user: userUsecase,
    repository: repositoryUsecase,
  },
};

export default dependencies;
