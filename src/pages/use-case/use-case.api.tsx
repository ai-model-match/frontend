import { callAuthApi } from "../../core/auth/auth.api";

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
    searchKey: string | null;
};

export type listUseCasesOutputDto = {
    hasNext: boolean;
    totalCount: number;
    items: useCaseDto[];
};
export const callListUseCaseApi = async (input: listUseCaseInputDto): Promise<listUseCasesOutputDto> => {
    const response = await callAuthApi(`/api/v1/use-cases`, 'GET', input);
    if (!response || !response.ok) {
        throw new Error('list-use-case-failed');
    }
    const data = await response.json();
    return data;
};