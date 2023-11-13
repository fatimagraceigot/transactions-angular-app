import { NgModule } from '@angular/core';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { StoreModule } from '@ngrx/store';
import {
  TRANSACTION_STATE_KEY,
  transactionReducer,
} from './store/transaction.reducers';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffects } from './store/transaction.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    TransactionsRoutingModule,
    TransactionsComponent,

    StoreModule.forFeature(TRANSACTION_STATE_KEY, transactionReducer),
    EffectsModule.forFeature([TransactionEffects]),

    MatSnackBarModule,
  ],
})
export class TransactionsModule {}
