
import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { assets } from "../../App";
import { callCreateUseCaseApi, useCasesOutputDto } from './use-case.api';


export default function NewUseCaseComponent() {
    // Services
    const navigate = useNavigate();
    const { t } = useTranslation();
    const Image = assets[`./assets/new-use-case.svg`] as React.FC<React.SVGProps<SVGSVGElement>>;

    // States
    const [apiloading, setApiLoading] = useState(false);
    const [useCaseCreated, setUseCaseCreated] = useState<useCasesOutputDto>();

    // Effects
    useEffect(() => {
        if (useCaseCreated) {
            navigate(`/use-cases/${useCaseCreated.item.id}/steps`, { replace: true });
        }
    }, [useCaseCreated]);

    const form = useForm({
        initialValues: {
            title: '',
            code: '',
            description: ''
        },
        validate: {
            title: (value: string) => value.trim().length != 0 ? null : t('fieldRequired'),
            code: (value: string) => value.trim().length != 0 ? null : t('fieldRequired'),
            description: (value: string) => value.trim().length != 0 ? null : t('fieldRequired')
        }
    });

    // Handles
    const handleSubmit = async (values: typeof form.values) => {
        try {
            setApiLoading(true);
            const data = await callCreateUseCaseApi({
                title: values.title,
                code: values.code,
                description: values.description
            });
            setUseCaseCreated(data);
        } catch (err: any) {
            switch (err.message) {
                case 'use-case-same-code-already-exists':
                    form.setFieldError('code', t('newUseCaseCodeInputAlreadyExists'));
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
                        <IconPlus size={18} />
                    </ThemeIcon>
                    <Text size={'lg'}>{t('newUseCaseTitle')}</Text>
                </Group>
                <Box w={'100%'} p={50} pt={20}><Box mt={30} component={Image} /></Box>
                <Group justify="space-between">
                    <Box w={'100%'} h={'100mah'}>
                        <TextInput
                            withAsterisk
                            label={t('newUseCaseTitleInput')}
                            placeholder={t('newUseCaseTitleInputPlaceholder')}
                            key={form.key('title')}
                            {...form.getInputProps('title')}
                            mb='sm'
                        />
                        <TextInput
                            withAsterisk
                            label={t('newUseCaseCodeInput')}
                            placeholder={t('newUseCaseCodeInputPlaceholder')}
                            key={form.key('code')}
                            {...form.getInputProps('code')}
                            mb='sm'
                        />
                        <Textarea
                            withAsterisk
                            rows={5}
                            label={t('newUseCaseDescriptionInput')}
                            placeholder={t('newUseCaseDescriptionInputPlaceholder')}
                            key={form.key('description')}
                            {...form.getInputProps('description')}
                            mb='sm'
                        />
                    </Box>
                </Group>
            </Box>
            <Box>
                <Button type='submit' mt={'lg'} loading={apiloading} fullWidth >
                    {t('newUseCaseCreateBtn')}
                </Button>
            </Box>
        </form>
    );
}
