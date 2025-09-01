'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories, deleteCategory } from "../services/apiService";
import { Category } from "../services/interfaces/interfaces";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

export default function CategoriesPage() {
    const { isAuthenticated } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (err) {
            setError("Failed to load categories. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCategories();
        }
    }, [isAuthenticated]);

    const handleOpenAddModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchCategories();
    }

    if (loading) {
        return <div className="flex items-center justify-center flex-grow">Loading categories...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center flex-grow text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8 gap-10">
                    <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
                    >
                        Add Category
                    </button>
                </div>

                <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
                    <ul className="divide-y divide-border">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <li key={cat.id} className="p-4 flex justify-between items-center">
                                    <span className="font-medium text-foreground">{cat.name}</span>
                                    <div className="space-x-2">
                                        <button onClick={() => handleOpenEditModal(cat)} className="text-sm text-foreground/60 hover:text-primary">Edit</button>
                                        <button
                                            onClick={async () => {
                                                await deleteCategory(cat.id);
                                                fetchCategories();
                                            }}
                                            className="text-sm text-red-500/80 hover:text-red-500">Delete</button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-foreground/60">You haven't created any categories yet.</li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <AddCategoryForm
                    onSuccess={handleSuccess}
                    onClose={handleCloseModal}
                    categoryToEdit={editingCategory}
                />
            </Modal>
        </>
    );
}