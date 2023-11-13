import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TransactionCreateComponent } from "./transaction-create.component";
import { FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideMockStore } from "@ngrx/store/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  TransactionCreate,
  TransactionType,
} from "../../../../core/transaction/transaction.interface";
import { selectBankAccounts } from "../../store/transaction.selectors";
import { createTransaction } from "../../store/transaction.actions";
import {
  amountShouldNotExceed,
  requireSimilarClientId,
} from "./form-validators";

describe("TransactionCreateComponent", () => {
  let component: TransactionCreateComponent;
  let fixture: ComponentFixture<TransactionCreateComponent>;

  const mockBankAccount = {
    id: 1,
    bank_name: "Bank A",
    account_holder_name: "Miss Jane A Smith",
    sort_code: "111111",
    account_number: "11111111",
    client_id: 1,
    current_value: 10000,
  };

  const mockTransaction = {
    transaction_type: TransactionType.TRANSFER,
    description: "Test Description",
    amount: 100,
    bank_account: {
      source: { ...mockBankAccount },
      target: { ...mockBankAccount },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        TransactionCreateComponent,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectBankAccounts,
              value: [{ ...mockBankAccount, ...mockBankAccount, id: 2 }],
            },
          ],
        }),
      ],
    }).compileComponents;

    fixture = TestBed.createComponent(TransactionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  describe("Transaction Form", () => {
    describe("buildForm()", () => {
      it("should create the form and form controls", () => {
        const form = component.transactionForm;

        component.buildForm();

        expect(form).toBeTruthy();
        expect(form.get("transaction_type")).toBeTruthy();
        expect(form.get("bank_account")).toBeTruthy();
        expect(form.get("description")).toBeTruthy();
        expect(form.get("amount")).toBeTruthy();
      });
    });

    describe("Form INVALID", () => {
      it("should expect form to be invalid if amount is 0", () => {
        component.transactionForm.setValue({
          ...mockTransaction,
          amount: 0,
        });
      });

      it("should expect form to be invalid if transaction type is null", () => {
        component.transactionForm.setValue({
          ...mockTransaction,
          transaction_type: null,
        });
      });

      describe("Transaction Type is equal to TRANSFER", () => {
        const transferTransaction = {
          ...mockTransaction,
          transaction_type: TransactionType.TRANSFER,
        };
        it("should expect form to be invalid if source and target are null", () => {
          component.transactionForm.setValue({
            ...transferTransaction,
            bank_account: {
              source: null,
              target: null,
            },
          });
        });

        it("should expect form to be invalid if source is null", () => {
          component.transactionForm.setValue({
            ...transferTransaction,
            bank_account: {
              source: { ...mockBankAccount },
              target: null,
            },
          });
        });

        it("should expect form to be invalid if target is null", () => {
          component.transactionForm.setValue({
            ...transferTransaction,
            bank_account: {
              source: null,
              target: { ...mockBankAccount },
            },
          });
        });

        it("should expect form to be invalid if source client id is not equal to target client id", () => {
          component.transactionForm.setValue({
            ...transferTransaction,
            bank_account: {
              source: { ...mockBankAccount, client_id: 1 },
              target: { ...mockBankAccount, client_id: 2 },
            },
          });
        });

        it("should expect form to be invalid if amount is greater than the source current value", () => {
          const sourceBankBalance = 2000;
          component.transactionForm.setValue({
            ...transferTransaction,
            amount: sourceBankBalance + 1,
            bank_account: {
              source: {
                ...mockBankAccount,
                client_id: 2,
                current_value: sourceBankBalance,
              },
              target: { ...mockBankAccount, client_id: 2 },
            },
          });
        });
      });

      describe("Transaction Type is equal to DEPOSIT", () => {
        const depositTransaction = {
          ...mockTransaction,
          transaction_type: TransactionType.DEPOSIT,
        };

        it("should expect form to be invalid if target is null, amount is not 0", () => {
          component.transactionForm.setValue({
            ...depositTransaction,
            amount: 100,
            bank_account: {
              source: null,
              target: null,
            },
          });
        });

        it("should expect form to be invalid if target is null, source is not null", () => {
          component.transactionForm.setValue({
            ...depositTransaction,
            amount: 100,
            bank_account: {
              source: { ...mockBankAccount },
              target: null,
            },
          });
        });

        it("should expect form to be invalid if amount is 0, target is not null", () => {
          component.transactionForm.setValue({
            ...depositTransaction,
            amount: 0,
            bank_account: {
              source: null,
              target: { ...mockBankAccount },
            },
          });
        });
      });

      describe("Transaction Type is equal to WITHDRAW", () => {
        const withdrawTransaction = {
          ...mockTransaction,
          transaction_type: TransactionType.WITHDRAW,
        };

        it("should expect form to be invalid if source is null", () => {
          component.transactionForm.setValue({
            ...withdrawTransaction,
            amount: 100,
            bank_account: {
              source: null,
              target: null,
            },
          });
        });

        it("should expect form to be invalid if source is null, target is not null", () => {
          component.transactionForm.setValue({
            ...withdrawTransaction,
            amount: 100,
            bank_account: {
              source: null,
              target: { ...mockBankAccount },
            },
          });
        });

        it("should expect form to be invalid if amount is 0, source is not null", () => {
          component.transactionForm.setValue({
            ...withdrawTransaction,
            amount: 0,
            bank_account: {
              source: { ...mockBankAccount },
              target: null,
            },
          });
        });

        it("should expect form to be invalid if amount is greater than the source value", () => {
          const sourceBankBalance = 200;
          component.transactionForm.setValue({
            ...withdrawTransaction,
            amount: sourceBankBalance + 100,
            bank_account: {
              source: { ...mockBankAccount, current_value: sourceBankBalance },
              target: null,
            },
          });
        });
      });

      afterEach(() => {
        expect(component.transactionForm.valid).toBe(false);
      });
    });

    describe("Form VALID", () => {
      it("should expect form to be valid if amount is more than zero", () => {
        component.transactionForm.setValue({
          ...mockTransaction,
          amount: 1,
        });
      });

      it("should expect form to be valid if transaction type is not null", () => {
        component.transactionForm.setValue({
          ...mockTransaction,
          transaction_type: TransactionType.DEPOSIT,
        });
      });

      describe("Transaction Type is equal to TRANSFER", () => {
        it("should expect form to be valid for amount less than current value and client id are the same ", () => {
          component.transactionForm.setValue({
            ...mockTransaction,
            transaction_type: TransactionType.TRANSFER,
            amount: 200,
            bank_account: {
              source: { ...mockBankAccount, client_id: 2, current_value: 500 },
              target: { ...mockBankAccount, client_id: 2 },
            },
          });

          expect(component.transactionForm.valid).toBe(true);
        });
      });

      describe("Transaction Type is equal to DEPOSIT", () => {
        it("should expect form to be valid  ", () => {
          component.transactionForm.setValue({
            ...mockTransaction,
            transaction_type: TransactionType.DEPOSIT,
            amount: 200,
            bank_account: {
              source: null,
              target: { ...mockBankAccount },
            },
          });

          expect(component.transactionForm.valid).toBe(true);
        });
      });

      describe("Transaction Type is equal to DEWITHDRAWPOSIT", () => {
        it("should expect form to be valid", () => {
          component.transactionForm.setValue({
            ...mockTransaction,
            transaction_type: TransactionType.WITHDRAW,
            amount: 200,
            bank_account: {
              source: { ...mockBankAccount, amount: 400 },
              target: null,
            },
          });

          expect(component.transactionForm.valid).toBe(true);
        });
      });
    });
  });

  describe("createTransaction()", () => {
    it("should not emit any event if form is invalid", () => {
      spyOn(component.store, "dispatch");
      component.transactionForm.setValue({
        ...mockTransaction,
        transaction_type: TransactionType.DEPOSIT,
        amount: 0,
      });

      component.createTransaction();

      expect(component.store.dispatch).not.toHaveBeenCalled();
    });

    it("should not emit any event if form is invalid", () => {
      spyOn(component.store, "dispatch");
      const transaction = {
        ...mockTransaction,
        transaction_type: TransactionType.TRANSFER,
        amount: 200,
        bank_account: {
          source: {
            ...mockBankAccount,
            id: 1,
            client_id: 3,
            current_value: 400,
          },
          target: {
            ...mockBankAccount,
            id: 2,
            client_id: 3,
            current_value: 200,
          },
        },
      };
      component.transactionForm.setValue(transaction);
      const newTransaction: TransactionCreate = {
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        source_bank_account_id: transaction.bank_account.source?.id,
        target_bank_account_id: transaction.bank_account.target?.id,
        description: transaction.description,
      };

      component.createTransaction();

      expect(component.store.dispatch).toHaveBeenCalledWith(
        createTransaction({ newTransaction })
      );
    });
  });

  describe("onTransactionTypeChange()", () => {
    describe("Transaction type selected is TRANSFER", () => {
      beforeEach(() => {
        component.onTransactionTypeChange(TransactionType.TRANSFER);
      });

      it("should set the source control validator to required", () => {
        const control = component.bankAccountFormGroup.controls["source"];
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
      });

      it("should set the target control validator to required", () => {
        const control = component.bankAccountFormGroup.controls["target"];
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
      });

      it("should set the bank account form group validator to requireSimilarClientId", () => {
        const control = component.bankAccountFormGroup;
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(requireSimilarClientId)).toBe(true);
      });

      it("should set the amount control validator to required, amountShouldNotExceed", () => {
        const control = component.amountControl;
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
        expect(control.hasValidator(amountShouldNotExceed)).toBe(true);
      });
    });

    describe("Transaction type selected is DEPOSIT", () => {
      beforeEach(() => {
        component.onTransactionTypeChange(TransactionType.DEPOSIT);
      });

      it("should set the source control validator to null", () => {
        const control = component.bankAccountFormGroup.controls["source"];
        expect(control.validator).toBeNull();
      });

      it("should set the target control validator to required", () => {
        const control = component.bankAccountFormGroup.controls["target"];
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
      });

      it("should set the bank account form group validator to null", () => {
        const control = component.bankAccountFormGroup;
        expect(control.validator).toBeNull();
      });

      it("should set the amount control validator to required", () => {
        const control = component.amountControl;
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
      });
    });

    describe("Transaction type selected is WITHDRAW", () => {
      beforeEach(() => {
        component.onTransactionTypeChange(TransactionType.WITHDRAW);
      });

      it("should set the source control validator to required", () => {
        const control = component.bankAccountFormGroup.controls["source"];
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
      });

      it("should set the target control validator to null", () => {
        const control = component.bankAccountFormGroup.controls["target"];
        expect(control.validator).toBeNull();
      });

      it("should set the bank account form group validator to null", () => {
        const control = component.bankAccountFormGroup;
        expect(control.validator).toBeNull();
      });

      it("should set the amount control validator to required", () => {
        const control = component.amountControl;
        expect(control.validator).not.toBeNull();
        expect(control.hasValidator(Validators.required)).toBe(true);
        expect(control.hasValidator(amountShouldNotExceed)).toBe(true);
      });
    });
  });
});
