'use client';

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    return (
        <header className="bg-card border-b border-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href={isAuthenticated && isMounted ? "/dashboard" : "/"} className="text-2xl font-bold text-primary">
                            FiTrack
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!isMounted ? (
                            <div className="w-24 h-8 bg-border/50 animate-pulse rounded-md"></div>
                        ) : isAuthenticated ? (
                            <>
                                <Link href="/dashboard" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/categories" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                    Categories
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}