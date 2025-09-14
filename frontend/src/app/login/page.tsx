'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [formError, setFormError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setEmailError(null);
        setPasswordError(null);
        setLoading(true);

        try {
            const response = await apiClient.post('/Auth/login', {
                email,
                password
            });

            login(response.data.token);

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    const validationErrors = err.response.data.errors;

                    if (validationErrors?.Email) {
                        setEmailError(validationErrors.Email[0]);
                    }
                    if (validationErrors?.Password) {
                        setPasswordError(validationErrors.Password[0]);
                    }
                } else if (err.response.status === 401) {
                    setFormError('Login failed. Please check your email and password.');
                } else {
                    setFormError('An unexpected error occurred. Please try again.');
                }
            } else {
                setFormError('Could not connect to the server.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
            <div className="w-full max-w-md p-6 space-y-6 bg-card border border-border rounded-xl shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                        Sign in to your account.
                    </h2>
                </div>
                <form className="mt-6 space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            autoComplete="email"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
                    </div>

                    {formError && (
                        <div className="p-3 text-sm text-red-700 bg-red-900/20 border border-red-500/50 rounded-md">
                            {formError}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-sm text-center text-foreground/80">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="font-medium text-primary hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}