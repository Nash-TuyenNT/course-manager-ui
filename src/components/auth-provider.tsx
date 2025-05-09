'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JwtUser } from '@/types/user';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    user: JwtUser | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<JwtUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();


    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
    }, [router]);

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            try {
                const decoded = jwtDecode<JwtUser>(storedToken);
                setUser(decoded);
            } catch (e) {
                console.error('Invalid token', e);
                logout();
            }
        }
    }, [logout]);

    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        setToken(token);
        setIsAuthenticated(true);
        try {
            const decoded = jwtDecode<JwtUser>(token);
            setUser(decoded);
        } catch (e) {
            console.error('Invalid token during login', e);
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, user, login, logout }}
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
