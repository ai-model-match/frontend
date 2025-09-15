import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/auth.context';
import { callLogoutApi } from './logout.api';

export default function LogoutPage() {
    // Services
    const navigate = useNavigate();
    const auth = useAuth();

    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        (async () => {
            try {
                if (auth.refreshToken) {
                    await callLogoutApi({ refreshToken: auth.refreshToken });
                }
            } catch (err) {
            } finally {
                auth.logout();
                navigate('/login', { replace: true });
            }
        })();
    }, [auth.loaded]);

    // Content
    return <></>;
}
