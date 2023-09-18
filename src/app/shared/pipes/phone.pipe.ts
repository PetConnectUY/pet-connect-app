import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneNumber: string): string {
    // Eliminar espacios en blanco y caracteres no deseados
    phoneNumber = phoneNumber.replace(/\s/g, '').replace(/\+/g, '');

    if(phoneNumber.startsWith('9') && !phoneNumber.startsWith('09')) {
      phoneNumber = '0' + phoneNumber;
    }

    // Agregar el prefijo +598 si no está presente
    if (!phoneNumber.startsWith('598') && !phoneNumber.startsWith('+598')) {
      phoneNumber = '(+598) ' + phoneNumber;
    }

    // Agregar el 0 después de +598 si no está presente
    if (phoneNumber.startsWith('+598') && !phoneNumber.startsWith('+5980')) {
      phoneNumber = phoneNumber.replace('+598', '(+598) 0');
    }

    if(phoneNumber.startsWith('598') && !phoneNumber.startsWith('+598')) {
      phoneNumber = phoneNumber.replace('598', '(+598)');
    }

    if(phoneNumber.startsWith('598') && !phoneNumber.startsWith('5980')) {
      phoneNumber = phoneNumber.replace('598', '(+598) 0');
    }

    // Formatear el número en grupos de 3
    phoneNumber = phoneNumber.replace(
      /(\+598\d{1})(\d{3})(\d{3})(\d{3})/,
      '($1) $2 $3 $4'
    );

    return phoneNumber;
  }

}
