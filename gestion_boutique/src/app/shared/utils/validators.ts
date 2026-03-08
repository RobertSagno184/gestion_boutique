import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    const valid = phoneRegex.test(control.value);

    return valid ? null : { invalidPhone: { value: control.value } };
  };
}

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value);
    const valid = !isNaN(value) && value > 0;

    return valid ? null : { invalidNumber: { value: control.value } };
  };
}

export function minStockValidator(minStock: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value);
    const valid = !isNaN(value) && value >= minStock;

    return valid ? null : { minStock: { value: control.value, minStock } };
  };
}
