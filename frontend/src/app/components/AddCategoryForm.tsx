'use client';

import { useState, useEffect, FormEvent } from "react";
import { createCategory, updateCategory } from "../services/apiService";
import { Category, CreateCategoryData } from "../services/interfaces/interfaces";
import axios from "axios";

interface AddCategoryFormProps {
    onSuccess: () => void;
    onClose: () => void;
    categoryToEdit?: Category | null;
}

export default function AddCategoryForm({ onSuccess, onClose, categoryToEdit }: AddCategoryFormProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!categoryToEdit;

    useEffect(() => {
        if (isEditMode) {
            setName(categoryToEdit!.name);
        }
    }, [isEditMode, categoryToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const categoryData: CreateCategoryData = { name };
            if (isEditMode) {
                await updateCategory(categoryToEdit.id, categoryData);
            } else {
                await createCategory(categoryData);
            }
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                setError(validationErrors?.Name?.[0]);
            } else {
                setError(`Failed to ${isEditMode ? 'update' : 'create'} category.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-foreground/80">Category Name</label>
                <input
                    type="text"
                    id="categoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-background border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-input focus:ring-ring'}`}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="bg-background border border-input px-4 py-2 rounded-md mr-2 hover:bg-border">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Category'}
                </button>
            </div>
        </form>
    );
}