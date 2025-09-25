export type Flow = {
  id: string;
  useCaseId: string;
  title: string;
  description: string;
  active: boolean;
  currentServePct: number;
  createdAt: string;
  updatedAt: string;
};

export type FlowStatistics = {
  id: string;
  flowId: string;
  useCaseId: string;
  totRequests: number;
  totSessionRequests: number;
  totFeedback: number;
  avgScore: number;
  createdAt: string;
  updatedAt: string;
};
