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

export default function AddTransactionForm({ accounts, categories, onSuccess, onClose }: AddTransactionFormProps){
    
}