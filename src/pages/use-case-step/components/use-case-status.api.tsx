import { callAuthApi } from '../../../core/auth/auth.api';

export type useCaseDto = {
  id: string;
  title: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type updateUseCaseInputDto = {
  id: string;
  active: boolean;
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
