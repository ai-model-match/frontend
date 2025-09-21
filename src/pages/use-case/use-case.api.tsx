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

export type orderByOptions = 'title' | 'code' | 'active' | 'created_at' | 'updated_at' | 'relevance';

export type listUseCaseInputDto = {
  page: number;
  pageSize: number;
  orderDir: 'asc' | 'desc';
  orderBy: orderByOptions;
  searchKey?: string;
};

export type listUseCaseOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: useCaseDto[];
};

export const callListUseCaseApi = async (input: listUseCaseInputDto): Promise<listUseCaseOutputDto> => {
  const response = await callAuthApi(`/api/v1/use-cases`, 'GET', input);
  if (!response) {
    throw new Error('list-use-case-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};

export type createUseCaseInputDto = {
  title: string;
  code: string;
  description: string;
};

export type createUseCaseOutputDto = {
  item: useCaseDto;
};

export const callCreateUseCaseApi = async (input: createUseCaseInputDto): Promise<createUseCaseOutputDto> => {
  const response = await callAuthApi(`/api/v1/use-cases`, 'POST', input);
  if (!response) {
    throw new Error('use-case-created-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};

export type deleteUseCaseInputDto = {
  id: string;
};

export const callDeleteUseCaseApi = async (input: deleteUseCaseInputDto): Promise<boolean> => {
  const response = await callAuthApi(`/api/v1/use-cases/${input.id}`, 'DELETE');
  if (!response) {
    throw new Error('use-case-deleted-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  return true;
};

export type updateUseCaseInputDto = {
  id: string;
  title: string;
  code: string;
  description: string;
};

export type updateUseCaseOutputDto = {
  item: useCaseDto;
};

export const callUpdateUseCaseApi = async (input: updateUseCaseInputDto): Promise<updateUseCaseOutputDto> => {
  const { id, ...rest } = input;
  const response = await callAuthApi(`/api/v1/use-cases/${id}`, 'PUT', { ...rest });
  if (!response) {
    throw new Error('use-case-updated-failed');
  }
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors[0]);
  }
  const data = await response.json();
  return data;
};
