import { useAuth } from '@context/AuthContext';
import { UseCase } from '@entities/useCase';
import { Modal, SegmentedControl, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCaseService } from '@services/useCaseService';
import { IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification } from '@utils/notificationUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UseCaseStatusConfirmComponent from './UseCaseStatusConfirmComponent';

export interface UseCaseStatusComponentProps {
  useCaseInput: UseCase;
  onUseCaseStatusChange: (useCase: UseCase) => void;
}

const USE_CASE_ACTIVE = 'active';
const USE_CASE_INACTIVE = 'inactive';

export default function UseCaseStatusComponent({
  useCaseInput,
  onUseCaseStatusChange,
}: UseCaseStatusComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);
  const [useCase, setUseCase] = useState(useCaseInput);

  // Use Case confirm panel status
  const [
    deactivateUseCaseOpen,
    { open: deactivateUseCaseActionsOpen, close: deactivateUseCaseActionsClose },
  ] = useDisclosure(false);

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
      const data = await useCaseService.updateUseCase({
        id: useCase.id,
        active: !useCase.active,
      });
      setUseCase(data.item);
      onUseCaseStatusChange(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-cannot-be-activated-without-active-flow':
          sendErrorNotification({
            id: 'use-case-cannot-be-activated-without-active-flow',
            icon: <IconX />,
            title: <Text>{t('updateUseCaseStepNotAllowed')}</Text>,
            message: <Text>{t('updateUseCaseStepNotAllowedDescription')}</Text>,
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
        size="md"
        withItemsBorders
        disabled={apiLoading || !auth.canWrite()}
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
