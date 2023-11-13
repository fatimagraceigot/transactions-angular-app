import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransactionState } from '../models/transaction-state.model';
import { TRANSACTION_STATE_KEY } from './transaction.reducers';
import {
  ExtendedTransaction,
  Transaction,
} from '../../../core/transaction/transaction.interface';
import { NestedBankAccount } from '../../../core/bank-account/bank-account.interface';

export const transactionState = createFeatureSelector<TransactionState>(
  TRANSACTION_STATE_KEY
);

export const selectExtendedTransactions = createSelector(
  transactionState,
  ({ transactions, bankAccounts }) => {
    return transactions.map((transaction: Transaction) => {
      const source = bankAccounts.find(
        (bankAccount) => bankAccount.id === transaction.source_bank_account_id
      );
      const target = bankAccounts.find(
        (bankAccount) => bankAccount.id === transaction.target_bank_account_id
      );

      const extendedTransaction = {
        ...transaction,
        source: source as NestedBankAccount,
        target: target as NestedBankAccount,
      } as ExtendedTransaction;

      return extendedTransaction;
    });
  }
);

export const selectBankAccounts = createSelector(transactionState, (state) => {
  return state.bankAccounts;
});
