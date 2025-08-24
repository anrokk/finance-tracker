'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [formError, setFormError] = useState<string | null>(null);

    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setUsernameError(null);
        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setLoading(true);

        try {
            const response = await apiClient.post('/Auth/register', {
                username,
                email,
                password,
                confirmPassword
            });

            const { token } = response.data;
            localStorage.setItem('authToken', token);
            router.push('/dashboard');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    const validationErrors = err.response.data.errors;
                    if (validationErrors) {
                        if (validationErrors.Username) setUsernameError(validationErrors.Username[0]);
                        if (validationErrors.Email) setEmailError(validationErrors.Email[0]);
                        if (validationErrors.Password) setPasswordError(validationErrors.Password[0]);
                        if (validationErrors.ConfirmPassword) setConfirmPasswordError(validationErrors.ConfirmPassword[0]);
                    } else {
                        setFormError('An unknown validation error occurred.');
                    }
                } else {
                    setFormError('An unexpected error occurred. Please try again.');
                }
            } else {
                setFormError('Could not connect to the server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div>
                        <input id="username" name="username" type="text"
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {usernameError && <p className="mt-1 text-xs text-red-600">{usernameError}</p>}
                    </div>
                    <div>
                        <input id="email-address" name="email" type="text"
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                    </div>
                    <div>
                        <input id="password" name="password" type="password"
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                    </div>
                    <div>
                        <input id="confirm-password" name="confirmPassword" type="password"
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {confirmPasswordError && <p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>}
                    </div>

                    {formError && (<div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{formError}</div>)}

                    <div>
                        <button type="submit" disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}