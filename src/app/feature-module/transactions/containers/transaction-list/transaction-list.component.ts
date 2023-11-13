import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { getExtendedTransactions } from '../../store/transaction.actions';
import { Subject, takeUntil } from 'rxjs';
import { ExtendedTransaction } from '../../../../core/transaction/transaction.interface';
import { selectExtendedTransactions } from '../../store/transaction.selectors';
import { TransactionState } from '../../models/transaction-state.model';

@Component({
  selector: 'fund-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule],
})
export class TransactionListComponent {
  protected transactionTableColumns: string[] = [
    'transaction_type',
    'sourceHolderName',
    'targetHolderName',
    'description',
    'amount',
  ];
  protected transactions: ExtendedTransaction[] = [];
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(public store: Store<TransactionState>) {}

  ngOnInit(): void {
    this.store.dispatch(getExtendedTransactions());

    this.store
      .select(selectExtendedTransactions)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((extendedTransactions) => {
        this.transactions = extendedTransactions;
      });
  }

  ngOnDestroy(): void {
    if (this.componentDestroyed$) {
      this.componentDestroyed$.next();
      this.componentDestroyed$.complete();
    }
  }
}
