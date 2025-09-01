'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAccounts, deleteAccount } from "../services/apiService";
import { Account } from "../services/interfaces/interfaces";
import Modal from "../components/Modal";
import AddAccountForm from "../components/AddAccountForm";

export default function AccountsPage() {
    const { isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const fetchAccounts = async () => {
        try {
            const accountsData = await getAccounts();
            setAccounts(accountsData);
        } catch (err) {
            setError("Failed to load accounts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAccounts();
        }
    }, [isAuthenticated]);

    const handleOpenAddModal = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchAccounts();
    };

    if (loading) {
        return <div className="flex items-center justify-center flex-grow">Loading accounts...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center flex-grow text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8 gap-10">
                    <h1 className="text-3xl font-bold text-foreground">Manage Accounts</h1>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
                    >
                        Add Account
                    </button>
                </div>

                <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
                    <ul className="divide-y divide-border">
                        {accounts.length > 0 ? (
                            accounts.map((acc) => (
                                <li key={acc.id} className="p-4 flex justify-between items-center">
                                    <span className="font-medium text-foreground">{acc.name}</span>
                                    <div className="space-x-2">
                                        <button onClick={() => handleOpenEditModal(acc)} className="text-sm text-foreground/60 hover:text-primary">Edit</button>
                                        <button
                                            onClick={async () => {
                                                await deleteAccount(acc.id);
                                                fetchAccounts();
                                            }}
                                            className="text-sm text-red-500/80 hover:text-red-500">Delete</button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-foreground/60">You haven't created any accounts yet.</li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingAccount ? 'Edit Account' : 'Add Account'}
            >
                <AddAccountForm
                    onSuccess={handleSuccess}
                    onClose={handleCloseModal}
                    accountToEdit={editingAccount}
                />
            </Modal>
        </>
    );
};