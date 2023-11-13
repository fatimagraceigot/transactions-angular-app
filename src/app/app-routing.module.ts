import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'transaction',
    loadChildren: () =>
      import('./feature-module/transactions/transactions.module').then(
        (m) => m.TransactionsModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'transaction',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
