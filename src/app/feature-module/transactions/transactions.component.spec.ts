import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getElementByDataTestAttribute } from 'src/app/utils/test-util';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, TransactionsComponent],
      providers: [provideMockStore()],
    }).compileComponents;

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('Add New Transaction button', () => {
    it('should call goToCreateTransaction function when button is clicked', () => {
      spyOn(component, 'goToCreateTransaction');

      const button = getElementByDataTestAttribute(
        fixture,
        'transaction-add-btn'
      );
      button.triggerEventHandler('click');
      fixture.detectChanges();

      expect(component.goToCreateTransaction).toHaveBeenCalled();
    });
  });

  describe('goToCreateTransaction()', () => {
    it('should navigate to create page', () => {
      spyOn(component.router, 'navigate');

      component.goToCreateTransaction();

      expect(component.router.navigate).toHaveBeenCalledWith([
        'transaction/create',
      ]);
    });
  });
});
