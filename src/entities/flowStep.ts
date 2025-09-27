export type FlowStep = {
  id: string;
  flowId: string;
  useCaseId: string;
  useCaseStepId: string;
  configuration: JSON;
  placeholders: string[];
  createdAt: string;
  updatedAt: string;
};
