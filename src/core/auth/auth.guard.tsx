'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.context';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // Services
    const navigate = useNavigate();
    const auth = useAuth();

    // States
    const [authenticated, setAuthenticated] = useState(false);

    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        if (!auth.accessToken) {
            auth.logout();
            navigate('/login', { replace: true });
        } else {
            setAuthenticated(true);
        }
    }, [auth, navigate, auth.accessToken]);

    // Content
    return authenticated ? <>{children}</> : null;
}
