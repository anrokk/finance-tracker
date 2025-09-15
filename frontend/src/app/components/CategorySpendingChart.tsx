'use client';

import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RPieChart, Pie, Cell } from 'recharts';

interface TransactionLike {
    id: string;
    name: string;
    amount: number;
    type: number; // 0 income, 1 expense
    date: string;
    categoryName?: string | null;
}

interface Props {
    transactions: TransactionLike[];
    selectedMonth?: string;
    onSelectedMonthChange?: (month: string) => void;
}

function formatMonth(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

type ChartType = 'bar' | 'pie';

export default function CategorySpendingChart({ transactions, selectedMonth: controlledSelectedMonth, onSelectedMonthChange }: Props) {
    const [uncontrolledSelectedMonth, setUncontrolledSelectedMonth] = useState<string>(formatMonth(new Date()));
    const selectedMonth = controlledSelectedMonth ?? uncontrolledSelectedMonth;
    const setSelectedMonth = onSelectedMonthChange ?? setUncontrolledSelectedMonth;
    const [chartType, setChartType] = useState<ChartType>('bar');

    const months = useMemo(() => {
        const set = new Set<string>();
        transactions.forEach(t => set.add(formatMonth(new Date(t.date))));
        const list = Array.from(set).sort().reverse();
        const current = formatMonth(new Date());
        if (!list.includes(current)) list.unshift(current);
        return list;
    }, [transactions]);

    const data = useMemo(() => {
        const categoryToAmount: Record<string, number> = {};
        transactions.forEach(t => {
            const d = new Date(t.date);
            const monthKey = formatMonth(d);
            if (monthKey !== selectedMonth) return;
            if (t.type !== 1) return; // only expenses
            const key = t.categoryName || 'Uncategorized';
            categoryToAmount[key] = (categoryToAmount[key] || 0) + Math.abs(t.amount);
        });
        const rows = Object.entries(categoryToAmount).map(([category, total]) => ({ category, total }));
        rows.sort((a, b) => b.total - a.total);
        return rows;
    }, [transactions, selectedMonth]);

    const goToThisMonth = () => setSelectedMonth(formatMonth(new Date()));

    const pieColors = [
        'hsl(173 40% 30%)',
        'hsl(210 10% 30%)',
        'hsl(222 15% 35%)',
        'hsl(210 5% 45%)',
        'hsl(222 8% 55%)',
        'hsl(210 6% 65%)'
    ];

    return (
        <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-lg font-medium text-foreground">Spending by Category</h3>
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-md border border-input overflow-hidden">
                        <button onClick={() => setChartType('bar')} className={`px-2.5 py-1.5 text-sm ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground/80 hover:bg-border/40'}`}>Bar</button>
                        <button onClick={() => setChartType('pie')} className={`px-2.5 py-1.5 text-sm ${chartType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground/80 hover:bg-border/40'}`}>Pie</button>
                    </div>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-background border border-input rounded-md px-2 py-1.5 text-sm"
                    >
                        {months.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <button onClick={goToThisMonth} className="px-2.5 py-1.5 text-sm rounded-md border border-input bg-background hover:bg-border/40">This month</button>
                </div>
            </div>
            {data.length === 0 ? (
                <p className="text-sm text-foreground/60">No expenses for selected month.</p>
            ) : (
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))' }} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }} />
                                <YAxis tick={{ fill: 'hsl(var(--foreground))' }} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }} />
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value: number) => [new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value), 'Total']}
                                />
                                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        ) : (
                            <RPieChart>
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value: number, name: string) => [new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value as number), name]}
                                />
                                <Pie data={data} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={2}>
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                            </RPieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}


