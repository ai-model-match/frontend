import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';

export type Permission = 'read' | 'write';

export interface JwtClaims {
  iss: string; // issuer
  sub: string; // subject (e.g., username)
  exp: number; // expiration timestamp (unix)
  iat: number; // issued at timestamp (unix)
  jti: string; // JWT ID
  permissions: Permission[]; // array of permissions
}

type AuthContextType = {
  loaded: boolean;
  username: string | null;
  permissions: string[];
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, accessToken: string, refreshToken: string) => void;
  refresh: (accessToken: string, refreshToken: string) => void;
  canWrite: () => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedAccess = localStorage.getItem('accessToken');
    const storedRefresh = localStorage.getItem('refreshToken');
    if (storedUser && storedAccess && storedRefresh) {
      setUsername(storedUser);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      const decoded = jwtDecode<JwtClaims>(storedAccess);
      setPermissions(decoded.permissions);
    }
    setLoaded(true);
  }, []);

  const login = (username: string, accessToken: string, refreshToken: string) => {
    setUsername(username);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const decoded = jwtDecode<JwtClaims>(accessToken);
    setPermissions(decoded.permissions);
  };

  const logout = () => {
    setUsername(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refresh = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const decoded = jwtDecode<JwtClaims>(accessToken);
    setPermissions(decoded.permissions);
  };

  const canWrite = () => {
    return permissions.includes('write');
  };

  return (
    <AuthContext.Provider
      value={{
        loaded,
        username,
        permissions,
        accessToken,
        refreshToken,
        login,
        refresh,
        logout,
        canWrite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
