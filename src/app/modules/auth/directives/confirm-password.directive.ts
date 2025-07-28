import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appConfirmPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmPasswordDirective,
      multi: true,
    },
  ],
})
export class ConfirmPasswordDirective implements Validator {
  @Input('appConfirmPassword') passwordField!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.root.get(this.passwordField);
    const confirmPassword = control;

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { confirmPasswordMismatch: true };
    }
    return null;
  }
}
