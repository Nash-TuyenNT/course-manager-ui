'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated: !!token, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider.');
    return context;
}
