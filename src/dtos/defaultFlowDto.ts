import {
  FlowOrderByOptions,
  GetFlowOutputDto,
  ListFlowInputDto,
  ListFlowOutputDto,
} from '@dtos/flowDto';
import { Flow } from '@entities/flow';
import { OrderDir } from '@services/api.type';

export const defaultFlow: Flow = {
  id: '',
  useCaseId: '',
  title: '',
  description: '',
  active: false,
  currentServePct: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultGetFlowApiResponse: GetFlowOutputDto = {
  item: defaultFlow,
};

export const defaultListFlowApiRequest: ListFlowInputDto = {
  useCaseId: '',
  page: 1,
  pageSize: 200,
  orderDir: OrderDir.DESC,
  orderBy: FlowOrderByOptions.CurrentPct,
};

export const defaultListFlowApiResponse: ListFlowOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
