import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionCreateComponent } from './containers/transaction-create/transaction-create.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    title: 'Transaction List - Fundment',
  },
  {
    path: 'create',
    component: TransactionCreateComponent,
    title: 'Create Transaction - Fundment',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
