import { useAuth } from '@context/AuthContext';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { authService } from '@services/authService';
import { IconKey, IconUser } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function LoginPageForm() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  // States
  const [apiloading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      password: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
    },
  });

  // Handles
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await authService.login({
        username: values.username,
        password: values.password,
      });
      auth.login(values.username, data.accessToken, data.refreshToken);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'invalid-username-or-password': {
          form.setFieldError('username', t('loginInvalidCredentials'));
          form.setFieldError('password', t('loginInvalidCredentials'));
          auth.logout();
          break;
        }
        default: {
          navigate('/internal-server-error');
          break;
        }
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Content
  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          leftSection={<IconUser size={16} />}
          withAsterisk
          label="Username"
          placeholder={t('loginTypeUsername')}
          key={form.key('username')}
          {...form.getInputProps('username')}
          mb="sm"
        />
        <PasswordInput
          leftSection={<IconKey size={16} />}
          withAsterisk
          label={'Password'}
          placeholder={t('loginTypePassword')}
          key={form.key('password')}
          {...form.getInputProps('password')}
          mb="xl"
        />
        <Button
          type="submit"
          mt={'lg'}
          loading={apiloading}
          loaderProps={{ type: 'dots' }}
          fullWidth
        >
          {t('loginBtnLogin')}
        </Button>
      </form>
    </Box>
  );
}
