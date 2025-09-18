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

export type getUseCaseInputDto = {
    id: string;
};

export type getUseCasesOutputDto = {
    item: useCaseDto;
};

export const callGetUseCaseApi = async (
    input: getUseCaseInputDto,
): Promise<getUseCasesOutputDto> => {
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
