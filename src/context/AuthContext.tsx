import { jwtDecode } from 'jwt-decode';
import { createContext, useContext } from 'react';

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
  getUsername: () => string | null;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getPermissions: () => string[];
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
  const getUsername = () => {
    return localStorage.getItem('username');
  };

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };

  const getPermissions = () => {
    const accessToken = getAccessToken();
    if (!accessToken) return [];
    const decoded = jwtDecode<JwtClaims>(accessToken);
    return decoded.permissions;
  };

  const login = (username: string, accessToken: string, refreshToken: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const refresh = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const canWrite = () => {
    const permissions = getPermissions();
    return permissions.includes('write');
  };

  return (
    <AuthContext.Provider
      value={{
        getUsername,
        getAccessToken,
        getRefreshToken,
        getPermissions,
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
