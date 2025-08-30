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
    const response = await apiClient.get<Account[]>("/accounts");
    return response.data;
}

export const createAccount = async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>("/accounts", data);
    return response.data;
}

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>("/transactions");
    return response.data;
}

export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post('/Transactions', data);
    return response.data;
};

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