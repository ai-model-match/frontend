import { Box, Container, Image, Paper, Title } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../../components/language/language-selector.component';
import { useAuth } from '../../core/auth/auth.context';
import LoginFormComponent from './components/login-form.component';
import classes from './login.module.css';
import { callRefreshApi } from './refresh.api';

export default function LoginPage() {
    // Development
    const effectRan = useRef(false);

    // Service
    const navigate = useNavigate();
    const { t } = useTranslation();
    const auth = useAuth();

    // State
    const [pageLoaded, setPageLoaded] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    // Effects
    useEffect(() => {
        if (authenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [authenticated]);

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
                const data = await callRefreshApi({
                    refreshToken: auth.refreshToken
                });
                auth.refresh(data.accessToken, data.refreshToken);
                setAuthenticated(true);
            } catch (err: any) {
                switch (err.message) {
                    case 'refresh-token-failed': {
                        auth.logout();
                        setPageLoaded(true);
                        break;
                    }
                    default: {
                        auth.logout();
                        alert(t('appGenericError'));
                        setPageLoaded(true);
                        break;
                    }
                }
            }
        })();
    }, [auth.loaded]);

    // Content
    return (
        pageLoaded &&
        <Box className={classes.root}>
            <LanguageSelector absolute></LanguageSelector>
            <Container className={classes.boxLogin}>
                <Paper p={'xl'} >
                    <Image src="/icon.svg" alt="Login Icon" className={classes.boxLogo} />
                    <Title className={classes.boxTitle} order={2} >
                        {t('appName')}
                    </Title>
                    <LoginFormComponent />
                </Paper>
            </Container>
        </Box >
    );
}
