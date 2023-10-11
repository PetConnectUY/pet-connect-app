import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  errorMessages: {[key: string]: string} = {
    required: 'El campo es requerido',
    minlength: 'El campo debe tener al menos {minlength} caracteres',
    maxlength: 'El campo debe tener menos de {maxlength} caracteres',
    pattern: 'El campo tiene caracteres inválidos',
    passwordPattern: 'La contraseña debe contener al menos una letra mayúscula',
    email: 'El campo debe contener un correo válido.',
    invalidGender: 'El genero es erróneo, debe seleccionar uno de la lista',
    invalidRace: 'La raza no es válida',
  };

  getErrorMessage(validatorName: string, validatorValue?: any): string {
    const errorMessage = this.errorMessages[validatorName];
    
    if (errorMessage && validatorValue) {
      if (validatorName === 'pattern' && validatorValue.requiredPattern === "^(?=.*[A-Z]).{6,}$") {
        return 'La contraseña debe contener al menos una letra mayúscula';
      }
      return errorMessage.replace('{minlength}', validatorValue?.requiredLength || '')
        .replace('{maxlength}', validatorValue?.requiredLength || '');
    }

    return errorMessage || 'Error desconocido';
  }

  minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
  
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 16);
  
      if (selectedDate > currentDate) {
        return { minDateError: true };
      }
  
      return null;
    };
  }

  constructor() { }
}
