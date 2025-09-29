import {
  ListFlowInputDto,
  ListFlowOutputDto,
  UpdateFlowInputDto,
  UpdateFlowOutputDto,
  GetFlowInputDto,
  GetFlowOutputDto,
  CreateFlowInputDto,
  CreateFlowOutputDto,
  DeleteFlowInputDto,
  DeleteFlowOutputDto,
  GetFlowStatisticsInputDto,
  GetFlowStatisticsOutputDto,
  UpdateFlowPctBulkInputDto,
  UpdateFlowPctBulkOutputDto,
} from '@dtos/flowDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const flowService = {
  async listFlows(input: ListFlowInputDto): Promise<ListFlowOutputDto> {
    const response = await callAuthApi(`/api/v1/flows`, Method.GET, input);
    if (!response) {
      throw new Error('flow-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getFlow(input: GetFlowInputDto): Promise<GetFlowOutputDto> {
    const response = await callAuthApi(`/api/v1/flows/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('flow-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createFlow(input: CreateFlowInputDto): Promise<CreateFlowOutputDto> {
    const response = await callAuthApi(`/api/v1/flows`, Method.POST, input);
    if (!response) {
      throw new Error('flow-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteFlow(input: DeleteFlowInputDto): Promise<DeleteFlowOutputDto> {
    const response = await callAuthApi(`/api/v1/flows/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('flow-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateFlow(input: UpdateFlowInputDto): Promise<UpdateFlowOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/flows/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('flow-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getFlowStatistics(
    input: GetFlowStatisticsInputDto
  ): Promise<GetFlowStatisticsOutputDto> {
    const response = await callAuthApi(
      `/api/v1/flows/${input.id}/flow-statistics`,
      Method.GET
    );
    if (!response) {
      throw new Error('flow-statistics-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async updateFlowPctBulk(
    input: UpdateFlowPctBulkInputDto
  ): Promise<UpdateFlowPctBulkOutputDto> {
    const response = await callAuthApi(`/api/v1/flows/bulk`, Method.PUT, input);
    if (!response) {
      throw new Error('flow-pct-bulk-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
