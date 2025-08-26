'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAccounts, getTransactions } from "../../../services/apiService";
import { Account, Transaction } from "../../../services/interfaces/interfaces";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const fetchData = async () => {
            try {
                const [accountsData, transactionsData] = await Promise.all([
                    getAccounts(),
                    getTransactions()
                ]);
                setAccounts(accountsData);
                setTransactions(transactionsData);
            } catch (err) {
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Accounts</h2>
                {accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account) => (
                            <div key={account.id} className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold text-gray-900">{account.name}</h3>
                                <p className="text-3xl font-semibold text-indigo-600 mt-2">{formatCurrency(account.currentBalance)}</p>
                                <p className="text-sm text-gray-500 mt-1">Initial Balance: {formatCurrency(account.startingBalance)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">You haven't added any accounts yet.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                            transactions.slice(0, 10).map((tx) => (
                                <li key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 truncate">{tx.name}</p>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <span>{new Date(tx.date).toLocaleDateString()}</span>
                                            <span className="mx-2">|</span>
                                            <span>{tx.accountName || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-bold ${tx.type === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.type === 0 ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-gray-500">No transactions found.</li>
                        )}
                    </ul>
                </div>
            </section>
        </div>
    );
}