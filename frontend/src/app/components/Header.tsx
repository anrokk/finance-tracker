'use client';

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { LayoutDashboard, Banknote, CreditCard, Tag, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    });

    return (
        <header className="bg-card/80 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/70">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href={isAuthenticated && isMounted ? "/dashboard" : "/"} className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
                            FiTrack
                        </Link>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        {!isMounted ? (
                            <div className="w-28 h-8 bg-border/50 animate-pulse rounded-md"></div>
                        ) : isAuthenticated ? (
                            <>
                                <Link href="/dashboard" className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-border/40 transition-colors">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <Link href="/transactions" className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-border/40 transition-colors">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="hidden sm:inline">Transactions</span>
                                </Link>
                                <Link href="/accounts" className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-border/40 transition-colors">
                                    <Banknote className="w-4 h-4" />
                                    <span className="hidden sm:inline">Accounts</span>
                                </Link>
                                <Link href="/categories" className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-border/40 transition-colors">
                                    <Tag className="w-4 h-4" />
                                    <span className="hidden sm:inline">Categories</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-border/40 transition-colors">
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                                <Link href="/register" className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
                                    <UserPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}