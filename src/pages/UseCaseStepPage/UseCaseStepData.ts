import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import {
  ListUseCaseStepsInputDto,
  ListUseCaseStepsOutputDto,
  UseCaseStepOrderByOptions,
} from '@dtos/useCaseStepDto';
import { UseCase } from '@entities/useCase';
import { UseCaseStep } from '@entities/useCaseStep';
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

export const defaultStep: UseCaseStep = {
  id: '',
  title: '',
  code: '',
  description: '',
  position: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultUseCaseApiResponse: GetUseCaseOutputDto = {
  item: defaultUseCase,
};

export const defaultStepApiRequest: ListUseCaseStepsInputDto = {
  useCaseId: '',
  page: 1,
  pageSize: 200,
  orderDir: OrderDir.ASC,
  orderBy: UseCaseStepOrderByOptions.Position,
};

export const defaultStepApiResponse: ListUseCaseStepsOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
