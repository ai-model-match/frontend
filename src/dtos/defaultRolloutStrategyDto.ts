import { RolloutStrategy, RolloutStrategyState } from '@entities/rolloutStrategy';
import {
  GetRolloutStrategyInputDto,
  GetRolloutStrategyOutputDto,
} from './rolloutStrategyDto';

export const defaultRolloutStrategy: RolloutStrategy = {
  id: '',
  useCaseId: '',
  rolloutState: RolloutStrategyState.INIT,
  configuration: {
    warmup: {
      intervalSessReqs: 0,
      intervalMins: 0,
      goals: [],
    },
    adaptive: {
      intervalMins: 0,
      maxStepPct: 0,
      minFeedback: 0,
    },
    escape: {
      rules: [],
    },
    stateConfigs: {
      completedFlowId: null,
    },
  },
  createdAt: '',
  updatedAt: '',
};

export const defaultGetRolloutStrategyApiRequest: GetRolloutStrategyInputDto = {
  useCaseId: '',
};
export const defaultGetRolloutStrategyApiResponse: GetRolloutStrategyOutputDto = {
  item: defaultRolloutStrategy,
};
