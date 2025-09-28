import { LanguageSelector } from '@components/LanguageSelector';
import { useAuth } from '@context/AuthContext';
import { Box, Container, Image, Paper, Title } from '@mantine/core';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './LoginPage.module.css';
import { LoginPageForm } from './LoginPageForm';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const effectRan = useRef(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!auth.loaded) return;
    if (effectRan.current) return;
    effectRan.current = true;
    (async () => {
      try {
        if (!auth.refreshToken) {
          auth.logout();
          setPageLoaded(true);
          return;
        }
        const data = await authService.refreshToken({
          refreshToken: auth.refreshToken,
        });
        auth.refresh(data.accessToken, data.refreshToken);
        navigate('/use-cases');
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed': {
            auth.logout();
            setPageLoaded(true);
            break;
          }
          default: {
            auth.logout();
            navigate('/internal-server-error', { replace: true });
            setPageLoaded(true);
            break;
          }
        }
      }
    })();
  }, [auth, t, navigate]);

  return (
    pageLoaded && (
      <Box className={classes.root}>
        <LanguageSelector absolutePosition></LanguageSelector>
        <Container className={classes.boxLogin}>
          <Paper p={'xl'}>
            <Image src="/icon.svg" alt="Login Icon" className={classes.boxLogo} />
            <Title className={classes.boxTitle} order={2}>
              {t('appName')}
            </Title>
            <LoginPageForm />
          </Paper>
        </Container>
      </Box>
    )
  );
}
