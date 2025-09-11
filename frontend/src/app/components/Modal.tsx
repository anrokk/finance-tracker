'use client';

import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-card-foreground tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-foreground/50 hover:text-foreground"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}