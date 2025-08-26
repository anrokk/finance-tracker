'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    nameid: string;
    jti: string;
    exp: number;
}

interface AuthContextType {
    token: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                    setUserId(decoded.nameid);
                } else {
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                localStorage.removeItem('authToken');
            }
        }
    }, []);

    const login = (newToken: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(newToken);
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            setUserId(decoded.nameid);
            router.push('/dashboard');
        } catch (error) {
            console.error("Invalid token");
        }
    }

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUserId(null);
        router.push('/login');
    };

    const value = {
        token,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}