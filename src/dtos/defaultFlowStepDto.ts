import { FlowStep } from '@entities/flowStep';
import { ListFlowStepInputDto, ListFlowStepOutputDto } from './flowStepDto';

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

export const defaultListFlowStepApiRequest: ListFlowStepInputDto = {
  flowId: '',
  page: 1,
  pageSize: 200,
};

export const defaultListFlowStepApiResponse: ListFlowStepOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
