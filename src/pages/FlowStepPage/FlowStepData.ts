import { GetFlowOutputDto } from '@dtos/flowDto';
import { ListFlowStepInputDto, ListFlowStepOutputDto } from '@dtos/flowStepDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { ListUseCaseStepsOutputDto } from '@dtos/useCaseStepDto';
import { Flow } from '@entities/flow';
import { FlowStep } from '@entities/flowStep';
import { UseCase } from '@entities/useCase';

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

export const defaultFlowStep: FlowStep = {
  id: '',
  flowId: '',
  useCaseId: '',
  useCaseStepId: '',
  configuration: JSON.parse('{}'),
  placeholders: [],
  createdAt: '',
  updatedAt: '',
};

export const defaultUseCaseApiResponse: GetUseCaseOutputDto = {
  item: defaultUseCase,
};

export const defaultFlowApiResponse: GetFlowOutputDto = {
  item: defaultFlow,
};

export const defaultFlowStepApiRequest: ListFlowStepInputDto = {
  flowId: '',
  page: 1,
  pageSize: 200,
};

export const defaultFlowStepApiResponse: ListFlowStepOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};

export const defaultUseCaseStepApiResponse: ListUseCaseStepsOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
