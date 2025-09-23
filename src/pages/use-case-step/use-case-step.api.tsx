import { callAuthApi } from '../../core/auth/auth.api';

export type useCaseDto = {
  id: string;
  title: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type useCaseStepDto = {
  id: string;
  title: string;
  code: string;
  description: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type getUseCaseInputDto = {
  id: string;
};

export type getUseCaseOutputDto = {
  item: useCaseDto;
};

export const callGetUseCaseApi = async (input: getUseCaseInputDto): Promise<getUseCaseOutputDto> => {
  const response = await callAuthApi(`/api/v1/use-cases/${input.id}`, 'GET');
  if (!response) {
    throw new Error('get-use-case-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};

export type orderByOptions = 'position' | 'created_at' | 'updated_at' | 'relevance';

export type listUseCaseStepsInputDto = {
  useCaseId: string;
  page: number;
  pageSize: number;
  orderDir: 'asc' | 'desc';
  orderBy: orderByOptions;
  searchKey: string | null;
};

export type listUseCaseStepsOutputDto = {
  items: useCaseStepDto[];
  totalCount: number;
  hasNext: boolean;
};

export const callListUseCaseStepsApi = async (input: listUseCaseStepsInputDto): Promise<listUseCaseStepsOutputDto> => {
  const response = await callAuthApi(`/api/v1/use-case-steps`, 'GET', input);
  if (!response) {
    throw new Error('use-case-step-list-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};

export type createUseCaseStepInputDto = {
  useCaseID: string;
  title: string;
  code: string;
  description: string;
};

export type createUseCaseStepOutputDto = {
  item: useCaseStepDto;
};

export const callCreateUseCaseStepApi = async (
  input: createUseCaseStepInputDto,
): Promise<createUseCaseStepOutputDto> => {
  const response = await callAuthApi(`/api/v1/use-case-steps`, 'POST', input);
  if (!response) {
    throw new Error('use-case-step-created-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};

export type deleteUseCaseStepInputDto = {
  id: string;
};

export const callDeleteUseCaseStepApi = async (input: deleteUseCaseStepInputDto): Promise<boolean> => {
  const response = await callAuthApi(`/api/v1/use-case-steps/${input.id}`, 'DELETE');
  if (!response) {
    throw new Error('use-case-step-deleted-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  return true;
};

export type updateUseCaseStepInputDto = {
  id: string;
  title: string;
  code: string;
  description: string;
  position: number;
};

export type updateUseCaseStepOutputDto = {
  item: useCaseStepDto;
};

export const callUpdateUseCaseStepApi = async (
  input: updateUseCaseStepInputDto,
): Promise<updateUseCaseStepOutputDto> => {
  const { id, ...rest } = input;
  const response = await callAuthApi(`/api/v1/use-case-steps/${id}`, 'PUT', { ...rest });
  if (!response) {
    throw new Error('use-case-step-updated-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};
