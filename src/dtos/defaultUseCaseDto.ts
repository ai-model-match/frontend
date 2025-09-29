import {
  GetUseCaseOutputDto,
  ListUseCaseInputDto,
  ListUseCaseOutputDto,
  UseCaseOrderByOptions,
} from '@dtos/useCaseDto';
import { UseCase } from '@entities/useCase';
import { OrderDir } from '@services/api.type';

export const defaultUseCase: UseCase = {
  id: '',
  title: '',
  code: '',
  description: '',
  active: false,
  createdAt: '',
  updatedAt: '',
};

export const defaultGetUseCaseApiResponse: GetUseCaseOutputDto = {
  item: defaultUseCase,
};

export const defaultListUseCaseApiRequest: ListUseCaseInputDto = {
  page: 1,
  pageSize: 5,
  orderDir: OrderDir.DESC,
  orderBy: UseCaseOrderByOptions.UpdatedAt,
};

export const defaultListUseCaseApiResponse: ListUseCaseOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
