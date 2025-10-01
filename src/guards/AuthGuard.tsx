'use client';

import { useAuth } from '@context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();

  // States
  const [authenticated, setAuthenticated] = useState(false);

  // Effects
  useEffect(() => {
    if (!auth.getAccessToken()) {
      auth.logout();
      navigate('/login', { replace: true });
    } else {
      setAuthenticated(true);
    }
  }, [auth, navigate]);

  // Content
  return authenticated ? <>{children}</> : null;
}
