import { FlowStep } from '@entities/flowStep';

export type ListFlowStepInputDto = {
  flowId: string;
  page: number;
  pageSize: number;
};

export type ListFlowStepOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: FlowStep[];
};

export type UpdateFlowStepInputDto = {
  id: string;
  configuration?: JSON;
};

export type UpdateFlowStepOutputDto = {
  item: FlowStep;
};

export type GetFlowStepInputDto = {
  id: string;
};

export type GetFlowStepOutputDto = {
  item: FlowStep;
};
