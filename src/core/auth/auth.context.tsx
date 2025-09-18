import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    loaded: boolean; // Indicates the Auth system loaded auth tokens from Local storage
    username: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (username: string, accessToken: string, refreshToken: string) => void;
    refresh: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);
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
    };

    return (
        <AuthContext.Provider
            value={{ loaded, username, accessToken, refreshToken, login, refresh, logout }}
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
