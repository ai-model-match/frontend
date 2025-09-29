import { useAuth } from '@context/AuthContext';
import { authService } from '@services/authService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          await authService.logout({ refreshToken: auth.refreshToken });
        }
      } catch (err: unknown) {
        void err;
      } finally {
        auth.logout();
        navigate('/login', { replace: true });
      }
    })();
  }, [auth, navigate]);

  // Content
  return <></>;
}
