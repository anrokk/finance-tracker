'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { login } = useAuth();

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

            login(response.data.token);

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
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
            <div className="w-full max-w-md p-6 space-y-6 bg-card border border-border rounded-xl shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-6 space-y-5" onSubmit={handleRegister}>
                    <div>
                        <input id="username" name="username" type="text"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {usernameError && <p className="mt-1 text-xs text-red-500">{usernameError}</p>}
                    </div>
                    <div>
                        <input id="email-address" name="email" type="text"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                    </div>
                    <div>
                        <input id="password" name="password" type="password"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
                    </div>
                    <div>
                        <input id="confirm-password" name="confirmPassword" type="password"
                            className="relative block w-full px-3 py-2 bg-background border border-input rounded-md placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {confirmPasswordError && <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>}
                    </div>

                    {formError && (<div className="p-3 text-sm text-red-700 bg-red-900/20 border border-red-500/50 rounded-md">{formError}</div>)}

                    <div>
                        <button type="submit" disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-sm text-center text-foreground/80">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}