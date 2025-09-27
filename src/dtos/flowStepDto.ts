import { FlowStep } from '@entities/flowStep';
import { TranscriptionCreateParams } from 'openai/resources/audio/transcriptions.mjs';
import { CompletionCreateParams } from 'openai/resources/completions.mjs';
import { FileCreateParams } from 'openai/resources/files.mjs';
import { JobCreateParams } from 'openai/resources/fine-tuning/jobs/jobs.mjs';
import { ImageGenerateParams } from 'openai/resources/images.mjs';
import { AudioTranscription } from 'openai/resources/realtime/realtime.mjs';

export type ListFlowStepInputDto = {
  flowId: string;
  page: number;
  pageSize: number;
};

export type ListFlowStepOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: FlowStep[];
};

export type UpdateFlowStepInputDto = {
  id: string;
  configuration?:
    | CompletionCreateParams
    | ImageGenerateParams
    | AudioTranscription
    | TranscriptionCreateParams
    | FileCreateParams
    | JobCreateParams;
};

export type UpdateFlowStepOutputDto = {
  item: FlowStep;
};

export type GetFlowStepInputDto = {
  id: string;
};

export type GetFlowStepOutputDto = {
  item: FlowStep;
};
