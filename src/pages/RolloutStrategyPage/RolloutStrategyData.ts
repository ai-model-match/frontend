import {
  RolloutStrategyConfiguration,
  RolloutStrategyState,
} from '@entities/rolloutStrategy';

export const getNextStates = (
  nextState: RolloutStrategyState,
  config: RolloutStrategyConfiguration
): RolloutStrategyState[] => {
  switch (nextState) {
    case RolloutStrategyState.INIT:
      return [RolloutStrategyState.WARMUP];
    case RolloutStrategyState.WARMUP:
      if (config.escape === null) {
        return [RolloutStrategyState.FORCED_COMPLETED, RolloutStrategyState.FORCED_STOP];
      }
      return [
        RolloutStrategyState.FORCED_COMPLETED,
        RolloutStrategyState.FORCED_ESCAPED,
        RolloutStrategyState.FORCED_STOP,
      ];
    case RolloutStrategyState.ADAPTIVE:
      if (config.escape === null) {
        return [RolloutStrategyState.FORCED_COMPLETED, RolloutStrategyState.FORCED_STOP];
      }
      return [
        RolloutStrategyState.FORCED_COMPLETED,
        RolloutStrategyState.FORCED_ESCAPED,
        RolloutStrategyState.FORCED_STOP,
      ];
    case RolloutStrategyState.COMPLETED:
      return [RolloutStrategyState.INIT];
    case RolloutStrategyState.ESCAPED:
      return [RolloutStrategyState.INIT];
    case RolloutStrategyState.FORCED_COMPLETED:
      return [RolloutStrategyState.INIT];
    case RolloutStrategyState.FORCED_ESCAPED:
      return [RolloutStrategyState.INIT];
    case RolloutStrategyState.FORCED_STOP:
      return [RolloutStrategyState.INIT];
    default:
      return [];
  }
};
