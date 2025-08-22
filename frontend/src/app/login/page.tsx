'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export default function LoginPage() {
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

            const { token } = response.data;
            localStorage.setItem('authToken', token);
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            autoComplete="email"
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
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
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                    </div>

                    {formError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {formError}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}