import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Transaction, TransactionType, UserProfile } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Transaction Queries with optimized caching
export function useGetAllTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      amount,
      transactionType,
      description,
    }: {
      date: string;
      amount: number;
      transactionType: TransactionType;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(date, amount, transactionType, description);
    },
    onMutate: async (newTransaction) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      await queryClient.cancelQueries({ queryKey: ['financialSummary'] });

      // Snapshot previous values
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      const previousSummary = queryClient.getQueryData(['financialSummary']);

      return { previousTransactions, previousSummary };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: Error, _newTransaction, context) => {
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(['financialSummary'], context.previousSummary);
      }
      toast.error(`Failed to add transaction: ${error.message}`);
    },
  });
}

export function useGetFinancialSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  }>({
    queryKey: ['financialSummary'],
    queryFn: async () => {
      if (!actor) return { totalIncome: 0, totalExpenses: 0, balance: 0 };
      return actor.getFinancialSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
