import { createAction, props } from '@ngrx/store';
import { BankAccount } from '../../../core/bank-account/bank-account.interface';
import {
  Transaction,
  TransactionCreate,
} from '../../../core/transaction/transaction.interface';

export const createTransaction = createAction(
  '[Transaction] Create Transaction',
  props<{ newTransaction: TransactionCreate }>()
);
export const createTransactionSuccess = createAction(
  '[Transaction] Create Transaction request success',
  props<{ transaction: Transaction }>()
);

export const getExtendedTransactions = createAction(
  '[Transaction] Get extended transactions'
);

export const getTransactions = createAction(
  '[Transaction] Get transactions request'
);
export const getTransactionsSuccess = createAction(
  '[Transaction] Get transactions request success',
  props<{ transactions: Transaction[] }>()
);

export const getBankAccounts = createAction(
  '[Transaction] Get bank accounts request'
);
export const getBankAccountsSuccess = createAction(
  '[Transaction] Get bank accounts request success',
  props<{ bankAccounts: BankAccount[] }>()
);

export const httpRequestError = createAction(
  '[Transaction] Request error',
  props<{ error: any }>()
);
