import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../App';
import { getErrorMessage } from '../../core/err/err';
import { callUpdateUseCaseApi, updateUseCaseOutputDto, useCaseDto } from './use-case.api';

interface UpdateUseCaseComponentProps {
    useCase: useCaseDto;
    onUseCaseUpdated: () => void;
}
export default function UpdateUseCaseComponent({
    useCase,
    onUseCaseUpdated,
}: UpdateUseCaseComponentProps) {
    // Services
    const navigate = useNavigate();
    const { t } = useTranslation();
    const Image = assets[`./assets/edit-use-case.svg`] as React.FC<React.SVGProps<SVGSVGElement>>;

    // States
    const [apiloading, setApiLoading] = useState(false);
    const [useCaseUpdated, setUseCaseUpdated] = useState<updateUseCaseOutputDto>();

    // Effects
    useEffect(() => {
        if (useCaseUpdated) {
            onUseCaseUpdated();
        }
    }, [useCaseUpdated, onUseCaseUpdated]);

    const form = useForm({
        initialValues: {
            title: useCase.title,
            code: useCase.code,
            description: useCase.description,
        },
        validate: {
            title: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
            code: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
            description: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
        },
    });

    // Handles
    const handleSubmit = async (values: typeof form.values) => {
        try {
            setApiLoading(true);
            const data = await callUpdateUseCaseApi({
                id: useCase.id,
                title: values.title,
                code: values.code,
                description: values.description,
            });
            setUseCaseUpdated(data);
        } catch (err: unknown) {
            switch (getErrorMessage(err)) {
                case 'use-case-same-code-already-exists':
                    form.setFieldError('code', t('updateUseCaseCodeInputAlreadyExists'));
                    break;
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Box>
                <Group justify="left" align="flex-start">
                    <ThemeIcon variant="filled" c={'white'} size={30}>
                        <IconEdit size={18} />
                    </ThemeIcon>
                    <Text size={'lg'}>{t('updateUseCaseTitle')}</Text>
                </Group>
                <Box w={'100%'} p={80} pt={10} pb={10}>
                    <Box mt={20} component={Image} />
                </Box>
                <Group justify="space-between">
                    <Box w={'100%'} h={'100mah'}>
                        <TextInput
                            withAsterisk
                            label={t('updateUseCaseTitleInput')}
                            placeholder={t('updateUseCaseTitleInputPlaceholder')}
                            key={form.key('title')}
                            {...form.getInputProps('title')}
                            mb="sm"
                        />
                        {useCase.active && (
                            <Tooltip
                                withArrow
                                style={{ fontSize: '12px' }}
                                label={t('updateUseCaseCodeCannotUpdate')}
                            >
                                <TextInput
                                    withAsterisk
                                    label={t('updateUseCaseCodeInput')}
                                    placeholder={t('updateUseCaseCodeInputPlaceholder')}
                                    key={form.key('code')}
                                    {...form.getInputProps('code')}
                                    mb="sm"
                                    disabled
                                />
                            </Tooltip>
                        )}
                        {!useCase.active && (
                            <TextInput
                                withAsterisk
                                label={t('updateUseCaseCodeInput')}
                                placeholder={t('updateUseCaseCodeInputPlaceholder')}
                                key={form.key('code')}
                                {...form.getInputProps('code')}
                                mb="sm"
                            />
                        )}
                        <Textarea
                            withAsterisk
                            rows={5}
                            label={t('updateUseCaseDescriptionInput')}
                            placeholder={t('updateUseCaseDescriptionInputPlaceholder')}
                            key={form.key('description')}
                            {...form.getInputProps('description')}
                            mb="sm"
                        />
                    </Box>
                </Group>
            </Box>
            <Box>
                <Button type="submit" mt={'lg'} loading={apiloading} fullWidth>
                    {t('updateUseCaseCreateBtn')}
                </Button>
            </Box>
        </form>
    );
}
