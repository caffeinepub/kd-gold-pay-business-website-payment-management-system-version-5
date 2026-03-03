import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Transaction } from '../backend';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Calendar, TrendingUp, PieChartIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export default function AnalyticsCharts({ transactions }: AnalyticsChartsProps) {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (startDate && endDate) {
      try {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        filtered = filtered.filter((tx) => {
          const txDate = parseISO(tx.date);
          return isWithinInterval(txDate, { start, end });
        });
      } catch (error) {
        console.error('Invalid date range:', error);
      }
    }

    return filtered;
  }, [transactions, startDate, endDate]);

  const monthlyData = useMemo(() => {
    const dataMap = new Map<string, { month: string; income: number; expenses: number }>();

    filteredTransactions.forEach((tx) => {
      try {
        const date = parseISO(tx.date);
        const monthKey = format(date, 'yyyy-MM');
        const monthLabel = format(date, 'MMM yyyy');

        if (!dataMap.has(monthKey)) {
          dataMap.set(monthKey, { month: monthLabel, income: 0, expenses: 0 });
        }

        const entry = dataMap.get(monthKey)!;
        if (tx.transactionType === 'Income') {
          entry.income += tx.amount;
        } else {
          entry.expenses += tx.amount;
        }
      } catch (error) {
        console.error('Error parsing transaction date:', error);
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredTransactions]);

  const balanceTrendData = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      try {
        return parseISO(a.date).getTime() - parseISO(b.date).getTime();
      } catch {
        return 0;
      }
    });

    let runningBalance = 0;
    const dataMap = new Map<string, { date: string; balance: number }>();

    sorted.forEach((tx) => {
      try {
        const date = parseISO(tx.date);
        const dateKey = format(date, 'yyyy-MM-dd');
        const dateLabel = format(date, 'MMM dd');

        if (tx.transactionType === 'Income') {
          runningBalance += tx.amount;
        } else {
          runningBalance -= tx.amount;
        }

        dataMap.set(dateKey, { date: dateLabel, balance: runningBalance });
      } catch (error) {
        console.error('Error processing balance trend:', error);
      }
    });

    return Array.from(dataMap.values());
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const incomeTotal = filteredTransactions
      .filter((tx) => tx.transactionType === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expensesTotal = filteredTransactions
      .filter((tx) => tx.transactionType === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return [
      { name: 'Income', value: incomeTotal, color: 'hsl(var(--chart-2))' },
      { name: 'Expenses', value: expensesTotal, color: 'hsl(var(--destructive))' },
    ].filter((item) => item.value > 0);
  }, [filteredTransactions]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="mb-2 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
          <CardDescription>Customize your analytics view</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch id="show-income" checked={showIncome} onCheckedChange={setShowIncome} />
              <Label htmlFor="show-income" className="cursor-pointer">
                Show Income
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-expenses" checked={showExpenses} onCheckedChange={setShowExpenses} />
              <Label htmlFor="show-expenses" className="cursor-pointer">
                Show Expenses
              </Label>
            </div>
            {(startDate || endDate) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar">
            <TrendingUp className="mr-2 h-4 w-4" />
            Bar Chart
          </TabsTrigger>
          <TabsTrigger value="line">
            <Calendar className="mr-2 h-4 w-4" />
            Line Chart
          </TabsTrigger>
          <TabsTrigger value="pie">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Pie Chart
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
              <CardDescription>Compare your income and expenses by month</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  No data available for the selected period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {showIncome && <Bar dataKey="income" name="Income" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />}
                    {showExpenses && (
                      <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance Trend Over Time</CardTitle>
              <CardDescription>Track how your balance changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              {balanceTrendData.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  No data available for the selected period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={balanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses Distribution</CardTitle>
              <CardDescription>Visual breakdown of your financial distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  No data available for the selected period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
