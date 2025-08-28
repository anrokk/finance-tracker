'use client';

import { useState, FormEvent } from "react";
import { createCategory } from "../services/apiService";
import axios from "axios";

interface AddCategoryFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function AddCategoryForm({ onSuccess, onClose }: AddCategoryFormProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createCategory({ name });
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    const validationErrors = err.response.data.errors;
                    if (validationErrors?.Name) {
                        setError(validationErrors.Name[0]);
                    } else {
                        setError("Failed to create category.");
                    }
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } else {
                setError("Could not connect to the server.");
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