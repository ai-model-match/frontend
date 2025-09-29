import type {
  ListUseCaseInputDto,
  ListUseCaseOutputDto,
  CreateUseCaseInputDto,
  CreateUseCaseOutputDto,
  DeleteUseCaseInputDto,
  DeleteUseCaseOutputDto,
  UpdateUseCaseInputDto,
  UpdateUseCaseOutputDto,
  GetUseCaseInputDto,
  GetUseCaseOutputDto,
} from '@dtos/useCaseDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const useCaseService = {
  async listUseCases(input: ListUseCaseInputDto): Promise<ListUseCaseOutputDto> {
    const response = await callAuthApi(`/api/v1/use-cases`, Method.GET, input);
    if (!response) {
      throw new Error('use-case-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getUseCase(input: GetUseCaseInputDto): Promise<GetUseCaseOutputDto> {
    const response = await callAuthApi(`/api/v1/use-cases/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('use-case-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createUseCase(input: CreateUseCaseInputDto): Promise<CreateUseCaseOutputDto> {
    const response = await callAuthApi(`/api/v1/use-cases`, Method.POST, input);
    if (!response) {
      throw new Error('use-case-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteUseCase(input: DeleteUseCaseInputDto): Promise<DeleteUseCaseOutputDto> {
    const response = await callAuthApi(`/api/v1/use-cases/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('use-case-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateUseCase(input: UpdateUseCaseInputDto): Promise<UpdateUseCaseOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/use-cases/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('use-case-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
