import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const requireSimilarClientId: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const source = control.get('source')?.value;
  const target = control.get('target')?.value;

  let error = null;
  if (source && target) {
    const isEqual = source?.client_id === target?.client_id;
    error = isEqual ? null : { clientDistinct: true };
  }
  return error;
};

export const amountShouldNotExceed: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const amount = control.value;

  let error = null;
  if (control) {
    const bankAccount = control.parent?.get('bank_account') as FormGroup;
    const sourceControl = bankAccount?.controls['source'];
    const sourceBalance = sourceControl.value?.current_value;

    if (sourceBalance) {
      const amountExceeded = amount > sourceBalance;
      error = amountExceeded ? { amountExceeded } : null;
    }
  }
  return error;
};
