import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BankAccount } from '../../../../core/bank-account/bank-account.interface';

@Component({
  selector: 'fund-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class AccountSelectorComponent {
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() bankAccounts: BankAccount[] | null = [];
}
