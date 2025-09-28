import { FlowOrderByOptions, ListFlowInputDto, ListFlowOutputDto } from '@dtos/flowDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { Flow } from '@entities/flow';
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

export const defaultFlow: Flow = {
  id: '',
  useCaseId: '',
  title: '',
  description: '',
  active: false,
  currentServePct: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultUseCaseApiResponse: GetUseCaseOutputDto = {
  item: defaultUseCase,
};

export const defaultFlowApiRequest: ListFlowInputDto = {
  useCaseId: '',
  page: 1,
  pageSize: 200,
  orderDir: OrderDir.DESC,
  orderBy: FlowOrderByOptions.CurrentPct,
};

export const defaultFlowApiResponse: ListFlowOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
