'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAccounts, getCategories, getTransactions, deleteTransaction } from "../services/apiService";
import { Account, Transaction, Category } from "../services/interfaces/interfaces";
import Modal from "../components/Modal";
import AddTransactionForm from "../components/AddTransactionForm";
import { Plus, Pencil, Trash2, FileSpreadsheet } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

export default function TransactionsPage() {
    const { isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const fetchData = async () => {
        try {
            const [transactionsData, accountsData, categoriesData] = await Promise.all([
                getTransactions(),
                getAccounts(),
                getCategories()
            ]);
            setTransactions(transactionsData);
            setAccounts(accountsData);
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

    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchData();
    };

    if (loading) {
        return <div className="flex items-center justify-center flex-grow text-foreground/60">Loading transactions...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center flex-grow text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 gap-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground inline-flex items-center gap-2"><FileSpreadsheet className="w-5 h-5"/> Manage Transactions</h1>
                    <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                        <Plus className="w-4 h-4"/> Add Transaction
                    </button>
                </div>

                <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-border/40">
                            <tr>
                                <th scope="col" className="px-5 py-3 text-left font-medium text-foreground/80 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-5 py-3 text-left font-medium text-foreground/80 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-5 py-3 text-left font-medium text-foreground/80 uppercase tracking-wider">Account</th>
                                <th scope="col" className="px-5 py-3 text-left font-medium text-foreground/80 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-5 py-3 text-left font-medium text-foreground/80 uppercase tracking-wider">Date</th>
                                <th scope="col" className="relative px-5 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-foreground">{tx.name}</td>
                                    <td className={`px-5 py-3 whitespace-nowrap font-semibold ${tx.type === 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(tx.amount)}</td>
                                    <td className="px-5 py-3 whitespace-nowrap text-foreground/80">{tx.accountName}</td>
                                    <td className="px-5 py-3 whitespace-nowrap text-foreground/80">{tx.categoryName || 'N/A'}</td>
                                    <td className="px-5 py-3 whitespace-nowrap text-foreground/80">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 whitespace-nowrap text-right font-medium">
                                        <div className="inline-flex items-center gap-3">
                                            <button onClick={() => handleOpenEditModal(tx)} className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-primary">
                                                <Pencil className="w-4 h-4"/> Edit
                                            </button>
                                            <button onClick={async () => { await deleteTransaction(tx.id); fetchData(); }} className="inline-flex items-center gap-1.5 text-red-600/80 hover:text-red-600">
                                                <Trash2 className="w-4 h-4"/> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <p className="p-4 text-center text-foreground/60">You have not added any transactions yet.</p>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}>
                <AddTransactionForm
                    onSuccess={handleSuccess}
                    onClose={handleCloseModal}
                    accounts={accounts}
                    categories={categories}
                    transactionToEdit={editingTransaction}
                ></AddTransactionForm>
            </Modal>
        </>
    );
}