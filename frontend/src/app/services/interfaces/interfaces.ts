export interface Account {
    id: string;
    name: string;
    startingBalance: number;
    currentBalance: number;
    userId: string;
}

export interface CreateAccountData {
    name: string;
    startingBalance: number;
}

export interface Transaction {
    id: string;
    name: string;
    description?: string;
    amount: number;
    date: string;
    type: 0 | 1; // 0 for income, 1 for expense
    userId: string;
    accountId?: string;
    accountName?: string;
    categoryId?: string;
    categoryName?: string;
}

export interface CreateTransactionData {
    name: string;
    description?: string;
    amount: number;
    date: string;
    type: 0 | 1;
    accountId?: string;
    categoryId?: string;
}

export interface Category {
    id: string;
    name: string;
    userId: string;
}

export interface CreateCategoryData {
    name: string;
}