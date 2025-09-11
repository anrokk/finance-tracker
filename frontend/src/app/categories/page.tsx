'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories, deleteCategory } from "../services/apiService";
import { Category } from "../services/interfaces/interfaces";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";

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
        return <div className="flex items-center justify-center flex-grow text-foreground/60">Loading categories...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center flex-grow text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 gap-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground inline-flex items-center gap-2"><Tags className="w-5 h-5"/> Manage Categories</h1>
                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4"/> Add Category
                    </button>
                </div>

                <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                    <ul className="divide-y divide-border">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <li key={cat.id} className="px-5 py-4 flex justify-between items-center">
                                    <span className="font-medium text-foreground truncate">{cat.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenEditModal(cat)} className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary">
                                            <Pencil className="w-4 h-4"/> Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await deleteCategory(cat.id);
                                                fetchCategories();
                                            }}
                                            className="inline-flex items-center gap-1.5 text-sm text-red-600/80 hover:text-red-600">
                                            <Trash2 className="w-4 h-4"/> Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-foreground/60">You have not created any categories yet.</li>
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