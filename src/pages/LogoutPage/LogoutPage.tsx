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
    (async () => {
      try {
        const refreshToken = auth.getRefreshToken();
        if (refreshToken) {
          await authService.logout({ refreshToken });
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
