import { useState, useMemo } from 'react';
import { useGetAllTransactions, useGetFinancialSummary } from '../hooks/useQueries';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, List, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardProps {
  userName: string;
}

export default function Dashboard({ userName }: DashboardProps) {
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useGetAllTransactions();
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useGetFinancialSummary();
  const [activeTab, setActiveTab] = useState('overview');

  // Memoize sorted transactions for performance
  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div className="container py-8">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h2>
            <p className="text-muted-foreground">Here's an overview of your financial activity</p>
          </div>
        </div>
      </div>

      {(transactionsError || summaryError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Failed to load some data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {summaryLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : summary ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SummaryCards summary={summary} />
              </div>
            ) : null}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center gap-2 transition-all duration-200">
                  <List className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 transition-all duration-200">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your income and expense transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : (
                      <TransactionList transactions={sortedTransactions} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {transactionsLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <Skeleton className="h-[400px] w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <AnalyticsCharts transactions={sortedTransactions} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <AddTransactionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
