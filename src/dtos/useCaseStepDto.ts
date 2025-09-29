import { UseCaseStep } from '@entities/useCaseStep';
import { OrderDir } from '@services/api.type';

export enum UseCaseStepOrderByOptions {
  Position = 'position',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  Relevance = 'relevance',
}

export type ListUseCaseStepInputDto = {
  useCaseId: string;
  page: number;
  pageSize: number;
  orderDir: OrderDir;
  orderBy: UseCaseStepOrderByOptions;
  searchKey?: string;
};

export type ListUseCaseStepOutputDto = {
  items: UseCaseStep[];
  totalCount: number;
  hasNext: boolean;
};

export type CreateUseCaseStepInputDto = {
  useCaseID: string;
  title: string;
  code: string;
  description: string;
};

export type CreateUseCaseStepOutputDto = {
  item: UseCaseStep;
};

export type DeleteUseCaseStepInputDto = {
  id: string;
};

export type DeleteUseCaseStepOutputDto = {
  success: boolean;
};

export type UpdateUseCaseStepInputDto = {
  id: string;
  title?: string;
  code?: string;
  description?: string;
  position?: number;
};

export type UpdateUseCaseStepOutputDto = {
  item: UseCaseStep;
};
