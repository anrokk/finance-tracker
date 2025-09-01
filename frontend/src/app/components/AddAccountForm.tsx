'use client';

import { useState, useEffect, FormEvent } from "react";
import { createAccount, updateAccount } from "../services/apiService";
import { Account, CreateAccountData } from "../services/interfaces/interfaces";
import axios from "axios";

interface AddAccountFormProps {
    onSuccess: () => void;
    onClose: () => void;
    accountToEdit?: Account | null;
}

export default function AddAccountForm({ onSuccess, onClose, accountToEdit }: AddAccountFormProps) {
    const [name, setName] = useState("");
    const [startingBalance, setStartingBalance] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!accountToEdit;

    useEffect(() => {
        if (isEditMode) {
            setName(accountToEdit!.name);
            setStartingBalance(accountToEdit!.startingBalance.toString());
        }
    }, [isEditMode, accountToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const balance = parseFloat(startingBalance) || 0;
            const accountData: CreateAccountData = { name, startingBalance: balance };
            if (isEditMode) {
                await updateAccount(accountToEdit!.id, accountData);
            } else {
                await createAccount(accountData);
            }
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                setError(validationErrors?.Name?.[0] || validationErrors?.startingBalance?.[0]);
            } else {
                setError(`Failed to ${isEditMode ? 'update' : 'create'} account.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-foreground/80">Account Name</label>
                <input
                    type="text"
                    id="accountName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-background border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-input focus:ring-ring'}`}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label htmlFor="startingBalance" className="block text-sm font-medium text-foreground/80">Starting Balance (€)</label>
                <input
                    type="number"
                    id="startingBalance"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-background border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-input focus:ring-ring'}`}
                    min="0"
                />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="bg-background border border-input px-4 py-2 rounded-md mr-2 hover:bg-border">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Account'}
                </button>
            </div>
        </form>
    );
}