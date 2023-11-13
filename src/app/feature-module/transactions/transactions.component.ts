import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TransactionListComponent } from './containers/transaction-list/transaction-list.component';
import { MatButtonModule } from '@angular/material/button';
import { TransactionCreateComponent } from './containers/transaction-create/transaction-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'fund-transaction',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TransactionListComponent,
    TransactionCreateComponent,
  ],
})
export class TransactionsComponent {
  constructor(public router: Router) {}

  goToCreateTransaction(): void {
    this.router.navigate(['transaction/create']);
  }
}
