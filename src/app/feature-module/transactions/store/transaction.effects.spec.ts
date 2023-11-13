import { Action } from '@ngrx/store';
import { TransactionEffects } from './transaction.effects';
import { Observable, of } from 'rxjs';
import { TransactionService } from '../../../core/transaction/transaction.service';
import { BankAccountService } from '../../../core/bank-account/bank-account.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import {
  createTransaction,
  createTransactionSuccess,
  getBankAccounts,
  getBankAccountsSuccess,
  getExtendedTransactions,
  getTransactions,
  getTransactionsSuccess,
} from './transaction.actions';
import {
  Transaction,
  TransactionType,
} from '../../../core/transaction/transaction.interface';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BankAccount } from '../../../core/bank-account/bank-account.interface';

describe('TransactionEffects', () => {
  let effects: TransactionEffects;
  let actions$: Observable<Action>;

  let mockTransactionService: TransactionService;
  let mockBankAccountService: BankAccountService;

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      transaction_type: TransactionType.DEPOSIT,
      amount: 100,
      source_bank_account_id: null,
      target_bank_account_id: 2,
      description: "Thomas' birthday present",
    },
    {
      id: 2,
      transaction_type: TransactionType.TRANSFER,
      amount: 12502,
      source_bank_account_id: 1,
      target_bank_account_id: 5,
      description: 'Janes transfer',
    },
  ];

  const mockBankAccounts: BankAccount[] = [
    {
      id: 1,
      bank_name: 'Bank A',
      account_holder_name: 'Miss Jane A Smith',
      sort_code: '111111',
      account_number: '11111111',
      client_id: 1,
      current_value: 128746.281,
    },
    {
      id: 2,
      bank_name: 'Bank B',
      account_holder_name: 'Thomas Christopher Wright',
      sort_code: '222222',
      account_number: '22222222',
      client_id: 2,
      current_value: 46.2,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      providers: [
        TransactionEffects,
        TransactionService,
        BankAccountService,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(TransactionEffects);
    mockTransactionService = TestBed.inject(TransactionService);
    mockBankAccountService = TestBed.inject(BankAccountService);
  });

  describe('getTransactions$', () => {
    it('should return action getTransactionsSuccess', () => {
      const transactions = mockTransactions;
      spyOn(mockTransactionService, 'getTransactions').and.returnValue(
        of(transactions)
      );

      actions$ = hot('--a-', {
        a: getTransactions(),
      });
      const expected = cold('--a-', {
        a: getTransactionsSuccess({ transactions }),
      });

      expect(effects.getTransactions$).toBeObservable(expected);
      expect(mockTransactionService.getTransactions).toHaveBeenCalled();
    });
  });

  describe('getBankAccounts$', () => {
    it('should return action getBankAccountsSuccess', () => {
      const bankAccounts = mockBankAccounts;
      spyOn(mockBankAccountService, 'getBankAccounts').and.returnValue(
        of(bankAccounts)
      );

      actions$ = hot('--a-', {
        a: getBankAccounts(),
      });
      const expected = cold('--a-', {
        a: getBankAccountsSuccess({ bankAccounts }),
      });

      expect(effects.getBankAccounts$).toBeObservable(expected);
      expect(mockBankAccountService.getBankAccounts).toHaveBeenCalled();
    });
  });

  describe('getExtendedTransactions$', () => {
    it('should return actions getTransactions and getBankAccounts', () => {
      actions$ = hot('--a-', {
        a: getExtendedTransactions(),
      });
      const expected = cold('--(ab)-', {
        a: getTransactions(),
        b: getBankAccounts(),
      });

      expect(effects.getExtendedTransactions$).toBeObservable(expected);
    });
  });

  describe('createTransaction$', () => {
    it('should return action getBankAccountsSuccess', () => {
      const newTransaction = {
        transaction_type: TransactionType.TRANSFER,
        amount: 100,
        source_bank_account_id: 1,
        target_bank_account_id: 2,
        description: '',
      };
      const transactionResponse = { ...mockTransactions[0] };
      spyOn(mockTransactionService, 'createTransaction').and.returnValue(
        of(transactionResponse)
      );

      actions$ = hot('--a-', {
        a: createTransaction({ newTransaction }),
      });
      const expected = cold('--a-', {
        a: createTransactionSuccess({
          transaction: transactionResponse,
        }),
      });

      expect(effects.createTransaction$).toBeObservable(expected);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        newTransaction
      );
    });
  });
});
