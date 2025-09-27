import {
  GetFlowStepInputDto,
  GetFlowStepOutputDto,
  ListFlowStepInputDto,
  ListFlowStepOutputDto,
  UpdateFlowStepInputDto,
  UpdateFlowStepOutputDto,
} from '@dtos/flowStepDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const flowStepService = {
  async listFlowSteps(input: ListFlowStepInputDto): Promise<ListFlowStepOutputDto> {
    const response = await callAuthApi(`/api/v1/flow-steps`, Method.GET, input);
    if (!response) {
      throw new Error('flow-step-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async updateFlowStep(input: UpdateFlowStepInputDto): Promise<UpdateFlowStepOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/flow-steps/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('flow-step-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getFlowStep(input: GetFlowStepInputDto): Promise<GetFlowStepOutputDto> {
    const response = await callAuthApi(`/api/v1/flow-steps/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('flow-step-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
