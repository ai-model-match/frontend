export enum RolloutStrategyState {
  INIT = 'INIT',
  WARMUP = 'WARMUP',
  ESCAPED = 'ESCAPED',
  ADAPTIVE = 'ADAPTIVE',
  COMPLETED = 'COMPLETED',
  FORCED_STOP = 'FORCED_STOP',
  FORCED_ESCAPED = 'FORCED_ESCAPED',
  FORCED_COMPLETED = 'FORCED_COMPLETED',
}

export type RsWarmup = {
  intervalMins: number | null;
  intervalSessReqs: number | null;
  goals: {
    flowId: string;
    finalServePct: number;
  }[];
};

export type RsEscape = {
  rules: {
    flowId: string;
    minFeedback: number;
    lowerScore: number;
    rollback: {
      flowId: string;
      finalServePct: number;
    }[];
  }[];
};

export type RsAdaptive = {
  minFeedback: number;
  maxStepPct: number;
  intervalMins: number;
};

export type RsStateConfigs = {
  completedFlowId: string | null;
};

export type RolloutStrategyConfiguration = {
  warmup: RsWarmup | null;
  escape: RsEscape | null;
  adaptive: RsAdaptive;
  stateConfigs: RsStateConfigs;
};

export type RolloutStrategy = {
  id: string;
  useCaseId: string;
  rolloutState: RolloutStrategyState;
  configuration: RolloutStrategyConfiguration;
  createdAt: string;
  updatedAt: string;
};
