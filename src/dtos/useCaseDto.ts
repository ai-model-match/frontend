import { UseCase } from '@entities/useCase';
import { OrderDir } from '@services/api.type';

export enum UseCaseOrderByOptions {
  Title = 'title',
  Code = 'code',
  Active = 'active',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  Relevance = 'relevance',
}

export type ListUseCaseInputDto = {
  page: number;
  pageSize: number;
  orderDir: OrderDir;
  orderBy: UseCaseOrderByOptions;
  searchKey?: string;
};

export type ListUseCaseOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: UseCase[];
};

export type GetUseCaseInputDto = {
  id: string;
};

export type GetUseCaseOutputDto = {
  item: UseCase;
};

export type CreateUseCaseInputDto = {
  title: string;
  code: string;
  description: string;
};

export type CreateUseCaseOutputDto = {
  item: UseCase;
};

export type DeleteUseCaseInputDto = {
  id: string;
};

export type DeleteUseCaseOutputDto = {
  success: boolean;
};

export type UpdateUseCaseInputDto = {
  id: string;
  title?: string;
  code?: string;
  description?: string;
  active?: boolean;
};

export type UpdateUseCaseOutputDto = {
  item: UseCase;
};
