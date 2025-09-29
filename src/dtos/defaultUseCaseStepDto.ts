import {
  ListUseCaseStepInputDto,
  ListUseCaseStepOutputDto,
  UseCaseStepOrderByOptions,
} from '@dtos/useCaseStepDto';
import { UseCaseStep } from '@entities/useCaseStep';
import { OrderDir } from '@services/api.type';

export const defaultUseCaseStep: UseCaseStep = {
  id: '',
  useCaseId: '',
  title: '',
  code: '',
  description: '',
  position: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultListUseCaseStepApiRequest: ListUseCaseStepInputDto = {
  useCaseId: '',
  page: 1,
  pageSize: 200,
  orderDir: OrderDir.ASC,
  orderBy: UseCaseStepOrderByOptions.Position,
};

export const defaultListUseCaseStepApiResponse: ListUseCaseStepOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
