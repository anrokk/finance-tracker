'use client';

import { useState, FormEvent } from "react";
import { createAccount } from "../services/apiService";

interface AddAccountFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function AddAccountForm({ onSuccess, onClose }: AddAccountFormProps) {
    const [name, setName] = useState("");
    const [startingBalance, setStartingBalance] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createAccount({ name, startingBalance: parseFloat(startingBalance) });
            onSuccess();
        } catch (err) {
            setError("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                <input
                    type="text"
                    id="accountName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-700">Starting Balance (€)</label>
                <input
                    type="number"
                    id="startingBalance"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    step="0.01"
                    min="0"
                />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                    {loading ? 'Saving...' : 'Save Account'}
                </button>
            </div>
        </form>
    );
}