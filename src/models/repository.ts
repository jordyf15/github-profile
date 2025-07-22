export interface Repository {
  id: number;
  name: string;
  description: string;
  htmlUrl: string;
  forksCount: number;
  stargazersCount: number;
  updatedAt: string;
  license?: License;
}

interface License {
  spdxId: string;
}
