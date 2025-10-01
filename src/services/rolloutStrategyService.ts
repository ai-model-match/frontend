import type {
  UpdateRolloutStrategyInputDto,
  UpdateRolloutStrategyOutputDto,
  GetRolloutStrategyInputDto,
  GetRolloutStrategyOutputDto,
  UpdateRolloutStrategyStateInputDto,
  UpdateRolloutStrategyStateOutputDto,
} from '@dtos/rolloutStrategyDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const rolloutStrategyService = {
  async getRolloutStrategy(
    input: GetRolloutStrategyInputDto
  ): Promise<GetRolloutStrategyOutputDto> {
    const response = await callAuthApi(
      `/api/v1/use-cases/${input.useCaseId}/rollout-strategy`,
      Method.GET
    );
    if (!response) {
      throw new Error('rollout-strategy-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async updateRolloutStrategy(
    input: UpdateRolloutStrategyInputDto
  ): Promise<UpdateRolloutStrategyOutputDto> {
    const { useCaseId, ...rest } = input;
    const response = await callAuthApi(
      `/api/v1/use-cases/${useCaseId}/rollout-strategy`,
      Method.PUT,
      {
        ...rest,
      }
    );
    if (!response) {
      throw new Error('rollout-strategy-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async updateRolloutStrategyState(
    input: UpdateRolloutStrategyStateInputDto
  ): Promise<UpdateRolloutStrategyStateOutputDto> {
    const { useCaseId, ...rest } = input;
    const response = await callAuthApi(
      `/api/v1/use-cases/${useCaseId}/rollout-strategy/state`,
      Method.PUT,
      {
        ...rest,
      }
    );
    if (!response) {
      throw new Error('rollout-strategy--state-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
