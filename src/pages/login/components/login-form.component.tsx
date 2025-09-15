import {
    Box,
    Button,
    PasswordInput,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconKey, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/auth.context';
import { callLoginApi } from './login.api';


export default function LoginFormComponent() {
    // Services
    const navigate = useNavigate();
    const { t } = useTranslation();
    const auth = useAuth();

    // States
    const [apiloading, setApiLoading] = useState(false);
    const [loginSuccessful, setLoginSuccessful] = useState(false);

    // Effects
    useEffect(() => {
        if (loginSuccessful) {
            navigate('/dashboard', { replace: true });
        }
    }, [loginSuccessful]);

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: {
            username: (value: string) => value.trim().length != 0 ? null : t('loginFieldRequired'),
            password: (value: string) => value.trim().length != 0 ? null : t('loginFieldRequired')
        }
    });

    // Handles
    const handleSubmit = async (values: typeof form.values) => {
        try {
            setApiLoading(true);
            const data = await callLoginApi({
                username: values.username,
                password: values.password
            });
            auth.login(values.username, data.accessToken, data.refreshToken);
            setLoginSuccessful(true);
        } catch (err) {
            form.setFieldError('username', t('loginInvalidCredentials'));
            form.setFieldError('password', t('loginInvalidCredentials'));
            auth.logout();
            setLoginSuccessful(false);
        } finally {
            setApiLoading(false);
        }
    };

    // Content
    return (
        <Box >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    leftSection={<IconUser size={16} />}
                    withAsterisk
                    label='Username'
                    placeholder={t('loginTypeUsername')}
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                    mb='sm'
                />
                <PasswordInput
                    leftSection={<IconKey size={16} />}
                    withAsterisk
                    label={'Password'}
                    placeholder={t('loginTypePassword')}
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                    mb='xl'
                />
                <Button type='submit' mt={'lg'} loading={apiloading} fullWidth >
                    {t('loginBtnLogin')}
                </Button>
            </form>
        </Box >
    );
}
