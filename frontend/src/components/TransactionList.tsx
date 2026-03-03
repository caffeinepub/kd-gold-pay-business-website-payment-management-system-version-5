import type { Transaction } from '../backend';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } catch {
      return 0;
    }
  });

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
        <p className="text-sm text-muted-foreground">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id.toString()}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-2 ${
                  transaction.transactionType === 'Income' ? 'bg-chart-2/10' : 'bg-destructive/10'
                }`}
              >
                {transaction.transactionType === 'Income' ? (
                  <ArrowUpCircle className="h-5 w-5 text-chart-2" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(transaction.date)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={transaction.transactionType === 'Income' ? 'default' : 'destructive'}>
                {transaction.transactionType}
              </Badge>
              <p
                className={`text-lg font-bold ${
                  transaction.transactionType === 'Income' ? 'text-chart-2' : 'text-destructive'
                }`}
              >
                {transaction.transactionType === 'Income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function Wallet({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
