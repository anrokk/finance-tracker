'use client';

import { useState, FormEvent } from "react";
import { createTransaction } from "../services/apiService";
import { Account, Category } from "../services/interfaces/interfaces";

interface AddTransactionFormProps {
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
    onClose: () => void;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AddTransactionForm({ accounts, categories, onSuccess, onClose }: AddTransactionFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(getTodayDateString());
    const [type, setType] = useState<0 | 1>(1); // 1 = Expense
    const [accountId, setAccountId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!accountId) {
            setError("Please select an account.");
            setLoading(false);
            return;
        }

        try {
            await createTransaction({
                name,
                description,
                amount: parseFloat(amount),
                date,
                type,
                accountId: accountId,
                categoryId: categoryId || undefined
            });

            onSuccess();
        } catch (err) {
            setError("Failed to create transaction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex space-x-4">
                <button type="button" onClick={() => setType(0)} className={`flex-1 p-2 rounded-md font-semibold ${type === 0 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Income</button>
                <button type="button" onClick={() => setType(1)} className={`flex-1 p-2 rounded-md font-semibold ${type === 1 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Expense</button>
            </div>

            <div>
                <label htmlFor="txName" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="txName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
                <label htmlFor="txDescription" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                    id="txDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="txAmount" className="block text-sm font-medium text-gray-700">Amount (€)</label>
                    <input type="number" id="txAmount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required step="0.01" min="0" />
                </div>
                <div className="flex-1">
                    <label htmlFor="txDate" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="txDate" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>

            <div>
                <label htmlFor="txAccount" className="block text-sm font-medium text-gray-700">Account</label>
                <select id="txAccount" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="" disabled>Select an account</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="txCategory" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
                <select id="txCategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">No category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>

            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                    {loading ? 'Saving...' : 'Save Transaction'}
                </button>
            </div>
        </form>
    );
}