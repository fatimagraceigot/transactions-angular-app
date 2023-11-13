import { createReducer, on } from '@ngrx/store';
import { TransactionState } from '../models/transaction-state.model';
import {
  createTransactionSuccess,
  getBankAccountsSuccess,
  getTransactionsSuccess,
} from './transaction.actions';

export const TRANSACTION_STATE_KEY = 'transactionState';

export const initialTransactionState: TransactionState = {
  transactions: [],
  bankAccounts: [],
};

export const transactionReducer = createReducer(
  initialTransactionState,
  on(getTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    transactions,
  })),
  on(getBankAccountsSuccess, (state, { bankAccounts }) => ({
    ...state,
    bankAccounts,
  })),
  on(createTransactionSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [...state.transactions, transaction],
  }))
);
