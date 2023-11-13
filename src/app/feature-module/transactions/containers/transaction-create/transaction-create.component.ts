import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  TransactionCreate,
  TransactionType,
} from "src/app/core/transaction/transaction.interface";
import { Observable, Subject, filter, merge, startWith, takeUntil } from "rxjs";
import { BankAccount } from "src/app/core/bank-account/bank-account.interface";
import { selectBankAccounts } from "../../store/transaction.selectors";
import {
  createTransaction,
  getBankAccounts,
} from "../../store/transaction.actions";
import { MatButtonModule } from "@angular/material/button";
import {
  amountShouldNotExceed,
  requireSimilarClientId,
} from "./form-validators";
import { TransactionState } from "../../models/transaction-state.model";
import { BankAccountsComponent } from "../../components/bank-accounts/bank-accounts.component";
import { Router } from "@angular/router";

@Component({
  selector: "fund-transaction-create",
  templateUrl: "./transaction-create.component.html",
  styleUrls: ["./transaction-create.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    BankAccountsComponent,
  ],
})
export class TransactionCreateComponent {
  protected transactionTypes: { label: string; value: string }[] = [
    {
      label: "Deposit",
      value: TransactionType.DEPOSIT,
    },
    {
      label: "Withdraw",
      value: TransactionType.WITHDRAW,
    },
    {
      label: "Transfer",
      value: TransactionType.TRANSFER,
    },
  ];

  transactionForm!: FormGroup;
  bankAccountFormGroup!: FormGroup;
  amountControl!: FormControl;
  sourceControl!: FormControl;
  protected transactionType: TransactionType = TransactionType.DEPOSIT;

  protected bankAccounts$!: Observable<BankAccount[]>;
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public store: Store<TransactionState>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  get amountDefaultValidators(): ValidatorFn[] {
    return [Validators.required, Validators.min(1)];
  }

  ngOnInit(): void {
    this.buildForm();

    this.bankAccounts$ = this.store.select(selectBankAccounts);
    this.store.dispatch(getBankAccounts());
  }

  buildForm(): void {
    this.transactionForm = this.formBuilder.group({
      transaction_type: [this.transactionType, Validators.required],
      bank_account: this.formBuilder.group({
        source: [null],
        target: [null],
      }),
      description: [null],
      amount: [0, this.amountDefaultValidators],
    });

    this.bankAccountFormGroup = this.transactionForm.controls[
      "bank_account"
    ] as FormGroup;
    this.amountControl = this.transactionForm.controls["amount"] as FormControl;
    this.sourceControl = this.bankAccountFormGroup?.controls[
      "source"
    ] as FormControl;
    const transactionTypeControl = this.transactionForm.controls[
      "transaction_type"
    ] as FormControl;

    transactionTypeControl.valueChanges
      .pipe(
        startWith(this.transactionType),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((type: TransactionType) => {
        this.onTransactionTypeChange(type);
      });

    this.sourceControl.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        if (
          this.transactionType === TransactionType.TRANSFER ||
          this.transactionType === TransactionType.WITHDRAW
        ) {
          this.amountControl.updateValueAndValidity();
        }
      });
  }

  onTransactionTypeChange(type: TransactionType) {
    this.transactionType = type;
    const targetControl = this.bankAccountFormGroup?.controls[
      "target"
    ] as FormControl;

    targetControl.reset();
    this.sourceControl.reset();
    this.amountControl.reset();

    if (type === TransactionType.TRANSFER) {
      this.setValidators(this.sourceControl, Validators.required);
      this.setValidators(targetControl, Validators.required);
      this.setValidators(this.bankAccountFormGroup, requireSimilarClientId);
      this.setValidators(this.amountControl, [
        ...this.amountDefaultValidators,
        amountShouldNotExceed,
      ]);
    } else if (type === TransactionType.DEPOSIT) {
      this.clearValidators(this.sourceControl);
      this.setValidators(targetControl, Validators.required);
      this.clearValidators(this.bankAccountFormGroup);
      this.setValidators(this.amountControl, this.amountDefaultValidators);
    } else if (type === TransactionType.WITHDRAW) {
      this.clearValidators(targetControl);
      this.setValidators(this.sourceControl, Validators.required);
      this.clearValidators(this.bankAccountFormGroup);
      this.setValidators(this.amountControl, [
        ...this.amountDefaultValidators,
        amountShouldNotExceed,
      ]);
    }
  }

  protected setValidators(
    control: AbstractControl,
    validators: ValidatorFn | ValidatorFn[]
  ): void {
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  protected clearValidators(control: AbstractControl): void {
    if (control) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  createTransaction(): void {
    if (this.transactionForm.valid) {
      const val = this.transactionForm.value;
      const newTransaction: TransactionCreate = {
        transaction_type: val.transaction_type,
        amount: val.amount,
        source_bank_account_id: val.bank_account.source?.id,
        target_bank_account_id: val.bank_account.target?.id,
        description: val.description,
      };
      this.store.dispatch(createTransaction({ newTransaction }));
    }
  }

  goToTransactions(): void {
    this.router.navigate(["/transaction"]);
  }

  ngOnDestroy(): void {
    if (this.componentDestroyed$) {
      this.componentDestroyed$.next();
      this.componentDestroyed$.complete();
    }
  }
}
