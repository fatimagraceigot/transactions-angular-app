import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountSelectorComponent } from './account-selector.component';
import { getElementByDataTestAttribute } from '../../../../utils/test-util';

describe('AccountSelectorComponent', () => {
  let component: AccountSelectorComponent;
  let fixture: ComponentFixture<AccountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AccountSelectorComponent,
      ],
    }).compileComponents;

    fixture = TestBed.createComponent(AccountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('Template Test', () => {
    it('should display the correct label', () => {
      const label = 'Source';
      component.label = label;

      fixture.detectChanges();

      const element = getElementByDataTestAttribute(
        fixture,
        'account-selector-label'
      );
      expect(element.nativeElement.textContent).toContain(
        `${label} bank account`
      );
    });
  });
});
