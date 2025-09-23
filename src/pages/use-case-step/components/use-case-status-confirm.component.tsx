import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseCaseStatusConfirmComponentProps {
  title: string;
  text: string;
  confirmTextRequired?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UseCaseStatusConfirmComponent({
  title,
  text,
  confirmTextRequired,
  onConfirm,
  onCancel,
}: UseCaseStatusConfirmComponentProps) {
  // Services
  const { t } = useTranslation();

  const [textToConfirm, setTextToConfirm] = useState<string>();
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);

  const form = useForm();

  // Calculate if the confirm button can be enabled
  useEffect(() => {
    setIsConfirmDisabled(confirmTextRequired !== undefined && textToConfirm !== t('deactivateMe'));
  }, [confirmTextRequired, textToConfirm, t]);

  // Content
  return (
    <form onSubmit={form.onSubmit(onConfirm)}>
      <Group justify="left" align="flex-start">
        <ThemeIcon variant="filled" c={'white'} size={30}>
          <IconX size={18} />
        </ThemeIcon>
        <Text size={'lg'}>{title}</Text>
      </Group>
      <Text size="sm" mt={10}>
        {text}
      </Text>
      {confirmTextRequired && (
        <TextInput
          mt={30}
          withAsterisk
          required
          label={t('deactivateMeInput')}
          onChange={(e) => setTextToConfirm(e.currentTarget.value)}
        />
      )}
      <Group mt="lg" justify="flex-end">
        <Button onClick={onCancel} variant="outline">
          {t('btnCancel')}
        </Button>
        <Button type="submit" disabled={isConfirmDisabled}>
          {t('btnConfirm')}
        </Button>
      </Group>
    </form>
  );
}
