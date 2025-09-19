import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../core/err/err';
import { callDeleteUseCaseApi, useCaseDto } from './use-case.api';

export interface DeleteUseCaseComponentProps {
    useCase: useCaseDto;
    title: string;
    text: string;
    confirmTextRequired?: boolean;
    onUseCaseDeleted: () => void;
    onClose: () => void;
}

export default function DeleteUseCaseComponent({
    useCase,
    title,
    text,
    confirmTextRequired,
    onClose,
    onUseCaseDeleted,
}: DeleteUseCaseComponentProps) {
    // Services
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [textConfirm, setTextConfirm] = useState<string>();
    const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);
    const [apiloading, setApiLoading] = useState(false);
    const [useCaseDeleted, setUseCaseDeleted] = useState<boolean>(false);

    // Calculate if the confirm button can be enabled
    useEffect(() => {
        setIsConfirmDisabled(confirmTextRequired !== undefined && textConfirm !== t('deleteMe'));
    }, [confirmTextRequired, textConfirm, t]);

    useEffect(() => {
        if (useCaseDeleted) {
            onUseCaseDeleted();
        }
    }, [useCaseDeleted, onUseCaseDeleted]);

    // Handles
    const handleSubmit = async () => {
        try {
            setApiLoading(true);
            await callDeleteUseCaseApi({ id: useCase.id });
            setUseCaseDeleted(true);
        } catch (err: unknown) {
            switch (getErrorMessage(err)) {
                case 'refresh-token-failed':
                    navigate('/logout');
                    break;
                default:
                    alert(t('appGenericError'));
                    break;
            }
        } finally {
            setApiLoading(false);
        }
    };

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
                    onChange={(e) => setTextConfirm(e.currentTarget.value)}
                />
            )}
            <Group mt="lg" justify="flex-end">
                <Button onClick={onClose} variant="outline">
                    {t('btnCancel')}
                </Button>
                <Button onClick={handleSubmit} disabled={isConfirmDisabled} loading={apiloading}>
                    {t('btnConfirm')}
                </Button>
            </Group>
        </>
    );
}
