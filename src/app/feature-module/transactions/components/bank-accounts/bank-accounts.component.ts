import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BankAccount } from '../../../../core/bank-account/bank-account.interface';
import { TransactionType } from '../../../../core/transaction/transaction.interface';
import { AccountSelectorComponent } from '../account-selector/account-selector.component';

@Component({
  selector: 'fund-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AccountSelectorComponent,
  ],
})
export class BankAccountsComponent {
  @Input() bankAccounts: BankAccount[] | null = [];
  @Input() bankAccountFormGroup!: FormGroup;
  @Input() transactionType: TransactionType = TransactionType.DEPOSIT;

  protected sourceControl!: FormControl;
  protected targetControl!: FormControl;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bankAccountFormGroup']?.currentValue) {
      this.sourceControl = this.bankAccountFormGroup?.controls[
        'source'
      ] as FormControl;
      this.targetControl = this.bankAccountFormGroup?.controls[
        'target'
      ] as FormControl;
    }
  }

  getAccountsToDisplay(account: BankAccount | null): BankAccount[] | null {
    const accountIdExcempt = account?.id;
    if (accountIdExcempt && this.bankAccounts) {
      return this.bankAccounts.filter(
        (account) => account.id !== accountIdExcempt
      );
    } else {
      return this.bankAccounts;
    }
  }

  get showSourceSection(): boolean {
    return (
      this.transactionType === TransactionType.WITHDRAW ||
      this.transactionType === TransactionType.TRANSFER
    );
  }

  get showTargetSection(): boolean {
    return (
      this.transactionType === TransactionType.DEPOSIT ||
      this.transactionType === TransactionType.TRANSFER
    );
  }
}
