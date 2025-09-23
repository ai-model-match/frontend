import { Modal, SegmentedControl } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UseCaseStatusConfirmComponent from './use-case-status-confirm.component';
import { callUpdateUseCaseApi } from './use-case-status.api';
import { useAuth } from '../../../core/auth/auth.context';
import { getErrorMessage } from '../../../core/err/err';
import { useCaseDto } from '../use-case-step.api';

export interface UseCaseStatusComponentProps {
  uc: useCaseDto;
  onUseCaseStatusChange: (useCase: useCaseDto) => void;
}

const USE_CASE_ACTIVE = 'active';
const USE_CASE_INACTIVE = 'inactive';

export default function UseCaseStatusComponent({ uc, onUseCaseStatusChange }: UseCaseStatusComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiloading, setApiLoading] = useState(false);
  const [useCase, setUseCase] = useState(uc);

  // Use Case confirm panel status
  const [deactivateUseCaseOpen, { open: deactivateUseCaseActionsOpen, close: deactivateUseCaseActionsClose }] =
    useDisclosure(false);

  const onStatusChange = async () => {
    if (useCase.active) {
      deactivateUseCaseActionsOpen();
    } else {
      await callAPI();
    }
  };

  const deactivateUseCaseConfirmed = () => {
    deactivateUseCaseActionsClose();
    callAPI();
  };

  const callAPI = async () => {
    try {
      setApiLoading(true);
      const data = await callUpdateUseCaseApi({
        id: useCase.id,
        active: !useCase.active,
      });
      setUseCase(data.item);
      onUseCaseStatusChange(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-cannot-be-activated-without-active-flow':
          notifications.show({
            id: 'use-case-cannot-be-activated-without-active-flow',
            position: 'top-right',
            withCloseButton: true,
            autoClose: 5000,
            title: t('updateUseCaseStepNotAllowed'),
            message: t('updateUseCaseStepNotAllowedDescription'),
            color: 'red',
            withBorder: true,
            loading: false,
          });
          break;
        case 'refresh-token-failed':
          navigate('/logout');
          break;
        default:
          navigate('/internal-server-error');
          break;
      }
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <>
      <SegmentedControl
        withItemsBorders
        disabled={apiloading || !auth.canWrite()}
        value={useCase.active ? USE_CASE_ACTIVE : USE_CASE_INACTIVE}
        color={
          auth.canWrite()
            ? useCase.active
              ? 'var(--mantine-color-teal-7)'
              : 'var(--mantine-color-dark-3)'
            : useCase.active
              ? 'var(--mantine-color-teal-9)'
              : 'var(--mantine-color-red-9)'
        }
        data={[
          { label: t('useCaseStatusActive'), value: USE_CASE_ACTIVE },
          { label: t('useCaseStatusInactive'), value: USE_CASE_INACTIVE },
        ]}
        onChange={onStatusChange}
      />
      <Modal
        opened={deactivateUseCaseOpen}
        onClose={deactivateUseCaseActionsClose}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <UseCaseStatusConfirmComponent
          title={t('deactivateUseCaseTitle')}
          text={t('deactivateUsecaseDescription')}
          confirmTextRequired={true}
          onCancel={deactivateUseCaseActionsClose}
          onConfirm={deactivateUseCaseConfirmed}
        />
      </Modal>
    </>
  );
}
