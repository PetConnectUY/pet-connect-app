import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  validateEmailFrom!: FormGroup;
  changeEmailForm!: FormGroup;
  validEmail: boolean = false;
  sumbitting: boolean = false;
  btnValue: string = 'Enviar código';
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.validateEmailFrom = this.fb.group({
      current_email: ['', [Validators.required, Validators.email]],
      new_email: ['', [Validators.required, Validators.email]],
    });

    this.validateEmailFrom.get('current_email')?.setErrors({ invalidEmail: false });

    this.changeEmailForm = this.fb.group({
      token: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.validateEmailFrom.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.validateEmailFrom.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.validateEmailFrom.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }

  validateEmail() {
    this.sumbitting = true;
    if(this.validateEmailFrom.valid) {
      const formData = new FormData();
      const { current_email, new_email } = this.validateEmailFrom.value;
      formData.append('current_email', current_email);
      formData.append('new_email', new_email);
      this.userService.validateExistentEmail(formData).subscribe({
        next: (res: Message) => {
          this.sumbitting = false;
          this.validEmail = true;
          this.btnValue = 'Validar código';
        },
        error: (error: HttpErrorResponse) => {
          this.sumbitting = false;
          if (error.status === 422 && error.error && error.error.error) {
            const currentEmailErrors = error.error.error.current_email;
            if(currentEmailErrors != undefined && currentEmailErrors[0] === 'El email actual no es correcto') {
              this.validateEmailFrom.get('current_email')?.setErrors({ invalidEmail: true });
            } else if(currentEmailErrors != undefined) {
              // Otros posibles errores del backend
              this.toastr.error(currentEmailErrors[0], 'Error', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            }
            const newEmailErrors = error.error.error.new_email;
            if(newEmailErrors != undefined && newEmailErrors[0] === 'El email nuevo ya está registrado') {
              this.validateEmailFrom.get('new_email')?.setErrors({ invalidNewEmail: true });
            } else if(newEmailErrors != undefined) {
              // Otros posibles errores del backend
              this.toastr.error(newEmailErrors[0], 'Error', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            }
          }
        }
      });
    }
  }

  changeEmail() {
    
  }
}
