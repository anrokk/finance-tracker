'use client';

import { use, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAccounts, getCategories, getTransactions } from "../services/apiService";
import { Account, Transaction, Category } from "../services/interfaces/interfaces";
import Modal from "../components/Modal";
import AddAccountForm from "../components/AddAccountForm";
import AddTransactionForm from "../components/AddTransactionForm";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [accountsData, transactionsData, categoriesData] = await Promise.all([
                getAccounts(),
                getTransactions(),
                getCategories()
            ]);
            setAccounts(accountsData);
            setTransactions(transactionsData);
            setCategories(categoriesData);
        } catch (err) {
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleSuccess = () => {
        setIsAddTransactionModalOpen(false);
        fetchData();
    };

    if (loading) {
        return <div className="flex items-center justify-center flex-grow">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-foreground/90">Your Accounts</h2>
                    </div>
                    {accounts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accounts.map((account) => (
                                <div key={account.id} className="bg-card border border-border p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-bold text-foreground">{account.name}</h3>
                                    <p className="text-3xl font-semibold text-primary mt-2">{formatCurrency(account.currentBalance)}</p>
                                    <p className="text-sm text-foreground/60 mt-1">Initial Balance: {formatCurrency(account.startingBalance)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card border-border p-6 rounded-lg text-center text-foreground/60">
                            You haven't added any accounts yet.
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-foreground/90">Recent Transactions</h2>
                        <button onClick={() => setIsAddTransactionModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                            + Add Transaction
                        </button>
                    </div>
                    <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
                        <ul className="divide-y divide-border">
                            {transactions.length > 0 ? (
                                transactions.slice(0, 10).map((tx) => (
                                    <li key={tx.id} className="p-4 flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="font-semibold text-white truncate">{tx.name}</p>
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

            <Modal isOpen={isAddTransactionModalOpen} onClose={() => setIsAddTransactionModalOpen(false)} title="Add New Transaction">
                <AddTransactionForm
                    accounts={accounts}
                    categories={categories}
                    onSuccess={handleSuccess}
                    onClose={() => setIsAddTransactionModalOpen(false)}
                />
            </Modal>
        </>
    );
}