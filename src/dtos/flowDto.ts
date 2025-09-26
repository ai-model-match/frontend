import { Flow, FlowStatistics } from '@entities/flow';
import { OrderDir } from '@services/api.type';

export enum FlowOrderByOptions {
  Title = 'title',
  Code = 'code',
  Active = 'active',
  CurrentPct = 'current_pct',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  Relevance = 'relevance',
}

export type ListFlowInputDto = {
  useCaseId: string;
  page: number;
  pageSize: number;
  orderDir: OrderDir;
  orderBy: FlowOrderByOptions;
  searchKey?: string;
};

export type ListFlowOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: Flow[];
};

export type GetFlowInputDto = {
  id: string;
};

export type GetFlowOutputDto = {
  item: Flow;
};

export type CreateFlowInputDto = {
  useCaseID: string;
  title: string;
  description: string;
};

export type CreateFlowOutputDto = {
  item: Flow;
};

export type DeleteFlowInputDto = {
  id: string;
};

export type DeleteFlowOutputDto = {
  success: boolean;
};

export type UpdateFlowInputDto = {
  id: string;
  title?: string;
  description?: string;
  active?: boolean;
  currentServePct?: number;
};

export type UpdateFlowOutputDto = {
  item: Flow;
};

export type GetFlowStatisticsInputDto = {
  id: string;
};

export type GetFlowStatisticsOutputDto = {
  item: FlowStatistics;
};

export type UpdateFlowPctInputDto = {
  flowId: string;
  currentServePct: number;
};

export type UpdateFlowPctBulkInputDto = {
  useCaseId: string;
  flows: UpdateFlowPctInputDto[];
};

export type UpdateFlowPctBulkOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: Flow[];
};
