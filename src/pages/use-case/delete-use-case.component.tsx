import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DeleteUseCaseComponentProps {
    title: string;
    text: string;
    confirmTextRequired?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function DeleteUseCaseComponent({
    title,
    text,
    confirmTextRequired,
    onClose,
    onConfirm,
}: DeleteUseCaseComponentProps) {
    // Services
    const { t } = useTranslation();
    const [textConfirm, setTextConfirm] = useState<string>('');

    const isDisabled = confirmTextRequired !== undefined && textConfirm !== t('deleteMe');

    // Content
    return (
        <>
            <Group justify="left" align="flex-start">
                <ThemeIcon variant="filled" c={'white'} size={30}>
                    <IconX size={18} />
                </ThemeIcon>
                <Text size={'lg'}>{title}</Text>
            </Group>
            <Text size="sm" mt={10}>
                {text}
            </Text>
            <Text size="sm" mt={10} fw={600}>
                {t('deleteUndo')}
            </Text>
            {confirmTextRequired && (
                <TextInput
                    mt={30}
                    withAsterisk
                    required
                    label={t('deleteMeInput')}
                    value={textConfirm}
                    onChange={(e) => setTextConfirm(e.currentTarget.value)}
                />
            )}
            <Group mt="lg" justify="flex-end">
                <Button onClick={onClose} variant="outline">
                    {t('btnCancel')}
                </Button>
                <Button onClick={onConfirm} disabled={isDisabled}>
                    {t('btnConfirm')}
                </Button>
            </Group>
        </>
    );
}
