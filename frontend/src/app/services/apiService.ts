import apiClient from "@/app/services/apiClient";
import {
    Account,
    CreateAccountData,
    Transaction,
    CreateTransactionData,
    Category,
    CreateCategoryData
} from "@/app/services/interfaces/interfaces";

export const getAccounts = async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>("/Accounts");
    return response.data;
}

export const createAccount = async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>("/Accounts", data);
    return response.data;
}

export const updateAccount = async (id: string, data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.put<Account>(`/Accounts/${id}`, data);
    return response.data;
}

export const deleteAccount = async (id: string): Promise<void> => {
    await apiClient.delete(`/Accounts/${id}`);
}

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>("/Transactions");
    return response.data;
}

export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post('/Transactions', data);
    return response.data;
};

export const updateTransaction = async (id: string, data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.put(`/Transactions/${id}`, data);
    return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
    await apiClient.delete(`/Transactions/${id}`);
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get('/Categories');
    return response.data;
};

export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post('/Categories', data);
    return response.data;
};

export const updateCategory = async (id: string, data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.put(`/Categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient.delete(`/Categories/${id}`);
};