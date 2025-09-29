import type {
  ListUseCaseStepInputDto,
  ListUseCaseStepOutputDto,
  CreateUseCaseStepInputDto,
  CreateUseCaseStepOutputDto,
  DeleteUseCaseStepInputDto,
  UpdateUseCaseStepInputDto,
  UpdateUseCaseStepOutputDto,
  DeleteUseCaseStepOutputDto,
} from '@dtos/useCaseStepDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const useCaseStepService = {
  async listUseCaseSteps(
    input: ListUseCaseStepInputDto
  ): Promise<ListUseCaseStepOutputDto> {
    const response = await callAuthApi(`/api/v1/use-case-steps`, Method.GET, input);
    if (!response) {
      throw new Error('use-case-step-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createUseCaseStep(
    input: CreateUseCaseStepInputDto
  ): Promise<CreateUseCaseStepOutputDto> {
    const response = await callAuthApi(`/api/v1/use-case-steps`, Method.POST, input);
    if (!response) {
      throw new Error('use-case-step-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteUseCaseStep(
    input: DeleteUseCaseStepInputDto
  ): Promise<DeleteUseCaseStepOutputDto> {
    const response = await callAuthApi(
      `/api/v1/use-case-steps/${input.id}`,
      Method.DELETE
    );
    if (!response) {
      throw new Error('use-case-step-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateUseCaseStep(
    input: UpdateUseCaseStepInputDto
  ): Promise<UpdateUseCaseStepOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/use-case-steps/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('use-case-step-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
