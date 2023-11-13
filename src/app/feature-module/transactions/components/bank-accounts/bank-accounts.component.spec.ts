import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BankAccountsComponent } from './bank-accounts.component';
import { TransactionType } from '../../../../core/transaction/transaction.interface';

describe('BankAccountsComponent', () => {
  let component: BankAccountsComponent;
  let fixture: ComponentFixture<BankAccountsComponent>;

  const mockBankAccountId1 = {
    id: 1,
    bank_name: 'Bank A',
    account_holder_name: 'Miss Jane A Smith',
    sort_code: '111111',
    account_number: '11111111',
    client_id: 1,
    current_value: 128746.281,
  };
  const mockBankAccountId2 = {
    id: 2,
    bank_name: 'Bank B',
    account_holder_name: 'Thomas Christopher Wright',
    sort_code: '222222',
    account_number: '22222222',
    client_id: 2,
    current_value: 46.2,
  };
  const mockBankAccountId3 = {
    id: 3,
    bank_name: 'Bank C',
    account_holder_name: 'Mr John Doe',
    sort_code: '333333',
    account_number: '33333333',
    client_id: 3,
    current_value: 123.82,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BankAccountsComponent],
    }).compileComponents;

    fixture = TestBed.createComponent(BankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccountsToDisplay()', () => {
    it('should return all bank accounts from the array if account param is null', () => {
      const allAccounts = [
        mockBankAccountId1,
        mockBankAccountId2,
        mockBankAccountId3,
      ];
      component.bankAccounts = allAccounts;

      const accountsToDisplay = component.getAccountsToDisplay(null);
      expect(accountsToDisplay).toEqual(allAccounts);
    });

    it('should return all bank accounts from the array except the passed account', () => {
      const allAccounts = [
        mockBankAccountId1,
        mockBankAccountId2,
        mockBankAccountId3,
      ];
      component.bankAccounts = allAccounts;

      const accountsToDisplay =
        component.getAccountsToDisplay(mockBankAccountId1);
      expect(accountsToDisplay).toEqual([
        mockBankAccountId2,
        mockBankAccountId3,
      ]);
      expect(accountsToDisplay).not.toEqual(allAccounts);
    });

    it('should return all bank accounts from the array except the passed account', () => {
      const allAccounts = [
        mockBankAccountId1,
        mockBankAccountId2,
        mockBankAccountId3,
      ];
      component.bankAccounts = allAccounts;

      const accountsToDisplay =
        component.getAccountsToDisplay(mockBankAccountId2);
      expect(accountsToDisplay).toEqual([
        mockBankAccountId1,
        mockBankAccountId3,
      ]);
      expect(accountsToDisplay).not.toEqual(allAccounts);
    });
  });

  describe('get showSourceSection', () => {
    describe('it should return true', () => {
      it('should return true if selected transaction type is Withdraw', () => {
        component.transactionType = TransactionType.WITHDRAW;
      });

      it('should return true if selected transaction type is Transfer', () => {
        component.transactionType = TransactionType.TRANSFER;
      });

      afterEach(() => {
        const showSourceSection = component.showSourceSection;

        expect(showSourceSection).toBe(true);
      });
    });

    it('should return false if selected transaction type is Deposit', () => {
      component.transactionType = TransactionType.DEPOSIT;

      const showSourceSection = component.showSourceSection;

      expect(showSourceSection).toBe(false);
    });
  });

  describe('get showTargetSection', () => {
    describe('it should return true', () => {
      it('should return true if selected transaction type is Withdraw', () => {
        component.transactionType = TransactionType.DEPOSIT;
      });

      it('should return true if selected transaction type is Transfer', () => {
        component.transactionType = TransactionType.TRANSFER;
      });

      afterEach(() => {
        const showTargetSection = component.showTargetSection;

        expect(showTargetSection).toBe(true);
      });
    });

    it('should return false if selected transaction type is Deposit', () => {
      component.transactionType = TransactionType.WITHDRAW;

      const showTargetSection = component.showTargetSection;

      expect(showTargetSection).toBe(false);
    });
  });
});
