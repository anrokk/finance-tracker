'use client';

import { useState, FormEvent, useEffect } from "react";
import { createTransaction, updateTransaction } from "../services/apiService";
import { Account, Category, Transaction, CreateTransactionData } from "../services/interfaces/interfaces";
import axios from "axios";

interface AddTransactionFormProps {
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
    onClose: () => void;
    transactionToEdit?: Transaction | null;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AddTransactionForm({ accounts, categories, onSuccess, onClose, transactionToEdit }: AddTransactionFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(getTodayDateString());
    const [type, setType] = useState<0 | 1>(1); // 1 = Expense
    const [accountId, setAccountId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!transactionToEdit;

    useEffect(() => {
        if (isEditMode && transactionToEdit) {
            setName(transactionToEdit.name);
            setDescription(transactionToEdit.description || "");
            setAmount(transactionToEdit.amount.toString());
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
            setType(transactionToEdit.type);
            setAccountId(transactionToEdit.accountId || "");
            setCategoryId(transactionToEdit.categoryId || "");
        }
    }, [isEditMode, transactionToEdit]);


    //TODO
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
            const formattedAmount = amount.replace(',', '.');

            const transactionData: CreateTransactionData = {
                name,
                description,
                amount: parseFloat(formattedAmount) || 0,
                date,
                type,
                accountId,
                categoryId: categoryId || undefined
            };

            if (isEditMode) {
                await updateTransaction(transactionToEdit!.id, transactionData);
            } else {
                await createTransaction(transactionData);
            }
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat();
                setError(errorMessages.join(' '));
            } else {
                setError(`Failed to ${isEditMode ? 'update' : 'create'} transaction.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
                <button type="button" onClick={() => setType(0)} className={`flex-1 p-2 rounded-md font-semibold transition-colors ${type === 0 ? 'bg-green-600 text-white' : 'bg-input hover:bg-border'}`}>Income</button>
                <button type="button" onClick={() => setType(1)} className={`flex-1 p-2 rounded-md font-semibold transition-colors ${type === 1 ? 'bg-red-600 text-white' : 'bg-input hover:bg-border'}`}>Expense</button>
            </div>


            <div>
                <label htmlFor="txName" className="block text-sm font-medium text-foreground/80">Name</label>
                <input type="text" id="txName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md" required />
            </div>

            <div>
                <label htmlFor="txDescription" className="block text-sm font-medium text-foreground/80">Description (Optional)</label>
                <textarea id="txDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md" />
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="txAmount" className="block text-sm font-medium text-foreground/80">Amount (€)</label>
                    <input type="text" inputMode="decimal" id="txAmount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md" required step="0.01" min="0" />
                </div>
                <div className="flex-1">
                    <label htmlFor="txDate" className="block text-sm font-medium text-foreground/80">Date</label>
                    <input type="date" id="txDate" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md" required />
                </div>
            </div>

            <div>
                <label htmlFor="txAccount" className="block text-sm font-medium text-foreground/80">Account</label>
                <select id="txAccount" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md" required>
                    <option value="" disabled>Select an account</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="txCategory" className="block text-sm font-medium text-foreground/80">Category (Optional)</label>
                <select id="txCategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md">
                    <option value="">No category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>

            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="bg-background border border-input px-4 py-2 rounded-md mr-2 hover:bg-border">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Transaction'}
                </button>
            </div>
        </form>
    );
}