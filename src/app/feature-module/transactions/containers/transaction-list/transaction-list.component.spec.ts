import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionListComponent } from './transaction-list.component';
import { getExtendedTransactions } from '../../store/transaction.actions';
import { selectExtendedTransactions } from '../../store/transaction.selectors';
import {
  ExtendedTransaction,
  TransactionType,
} from '../../../../core/transaction/transaction.interface';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;

  const mockExtendedTransactions: ExtendedTransaction[] = [
    {
      id: 1,
      transaction_type: TransactionType.DEPOSIT,
      amount: 100,
      source_bank_account_id: null,
      target_bank_account_id: 2,
      description: "Thomas' birthday present",
      target: {
        bank_name: 'Bank C',
        account_holder_name: 'Mr John Doe',
        sort_code: '333333',
        account_number: '33333333',
      },
      source: {
        bank_name: 'Bank C',
        account_holder_name: 'Mr John Doe',
        sort_code: '333333',
        account_number: '33333333',
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectExtendedTransactions,
              value: mockExtendedTransactions,
            },
          ],
        }),
      ],
    }).compileComponents;

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should dispatch getExtendedTransaction action', () => {
      spyOn(component.store, 'dispatch');

      component.ngOnInit();

      expect(component.store.dispatch).toHaveBeenCalledWith(
        getExtendedTransactions()
      );
    });
  });
});
