import { BankAccount } from '../../../core/bank-account/bank-account.interface';
import { Transaction } from '../../../core/transaction/transaction.interface';

export interface TransactionState {
  transactions: Transaction[];
  bankAccounts: BankAccount[];
}
