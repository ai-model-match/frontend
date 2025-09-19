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

export const callGetUseCaseApi = async (
    input: getUseCaseInputDto,
): Promise<getUseCaseOutputDto> => {
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

export const callListUseCaseStepsApi = async (
    input: listUseCaseStepsInputDto,
): Promise<listUseCaseStepsOutputDto> => {
    const response = await callAuthApi(`/api/v1/use-case-steps`, 'GET', input);
    if (!response) {
        throw new Error('get-use-case-steps-failed');
    }
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
};
