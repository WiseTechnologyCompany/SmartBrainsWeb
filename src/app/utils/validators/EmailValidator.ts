import { FormControl, ValidationErrors } from "@angular/forms";

export class EmailValidator {

    static emailValidator(control: FormControl): ValidationErrors | null {
        const email = control.value;
    
        if (!email.includes('@') || (!email.endsWith('.com') && !email.endsWith('.br'))) {
          return { invalidEmail: true };
        }
    
        return null;
      }
}