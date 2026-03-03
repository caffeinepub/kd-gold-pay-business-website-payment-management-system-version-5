import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: bigint;
    transactionType: TransactionType;
    owner: Principal;
    date: string;
    description: string;
    amount: number;
}
export enum TransactionType {
    Income = "Income",
    Expense = "Expense"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTransaction(date: string, amount: number, transactionType: TransactionType, description: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinancialSummary(): Promise<{
        balance: number;
        totalIncome: number;
        totalExpenses: number;
    }>;
    getTransaction(id: bigint): Promise<Transaction>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTransactions(user: Principal): Promise<Array<Transaction>>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
