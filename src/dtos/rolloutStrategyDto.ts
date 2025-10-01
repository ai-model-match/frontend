import {
  RolloutStrategy,
  RolloutStrategyConfiguration,
  RolloutStrategyState,
} from '@entities/rolloutStrategy';

export type GetRolloutStrategyInputDto = {
  useCaseId: string;
};

export type GetRolloutStrategyOutputDto = {
  item: RolloutStrategy;
};

export type UpdateRolloutStrategyInputDto = {
  useCaseId: string;
  configuration: RolloutStrategyConfiguration;
};

export type UpdateRolloutStrategyOutputDto = {
  item: RolloutStrategy;
};

export type UpdateRolloutStrategyStateInputDto = {
  useCaseId: string;
  state: RolloutStrategyState;
  completedFlowId?: string;
};

export type UpdateRolloutStrategyStateOutputDto = {
  item: RolloutStrategy;
};
