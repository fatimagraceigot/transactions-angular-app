import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createTransaction,
  createTransactionSuccess,
  getBankAccounts,
  getBankAccountsSuccess,
  getExtendedTransactions,
  getTransactions,
  getTransactionsSuccess,
  httpRequestError,
} from './transaction.actions';
import { TransactionService } from '../../../core/transaction/transaction.service';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BankAccountService } from '../../../core/bank-account/bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTransactions),
      exhaustMap(() =>
        this.transactionService.getTransactions().pipe(
          map((transactions) => getTransactionsSuccess({ transactions })),
          catchError((error) => of(httpRequestError({ error })))
        )
      )
    )
  );

  getBankAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBankAccounts),
      exhaustMap(() =>
        this.bankAccountService.getBankAccounts().pipe(
          map((bankAccounts) => getBankAccountsSuccess({ bankAccounts })),
          catchError((error) => of(httpRequestError({ error })))
        )
      )
    )
  );

  getExtendedTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getExtendedTransactions),
      mergeMap(() => [getTransactions(), getBankAccounts()])
    )
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTransaction),
      exhaustMap(({ newTransaction }) =>
        this.transactionService.createTransaction(newTransaction).pipe(
          map((transaction) => createTransactionSuccess({ transaction })),
          catchError((error) => of(httpRequestError({ error })))
        )
      )
    )
  );

  createTransactionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTransactionSuccess),
        tap((action) => {
          this.snackBar.open(
            `${action.transaction.transaction_type} COMPLETE.`,
            'OK',
            {
              duration: 3000,
            }
          );
          this.router.navigate(['/transaction']);
        })
      ),
    { dispatch: false }
  );
}
