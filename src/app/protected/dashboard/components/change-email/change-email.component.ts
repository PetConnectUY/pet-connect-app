import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronRight, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;
  faExclamationCircle = faExclamationCircle;

  @Output() emitUser = new EventEmitter<User | null>;

  unknowError: boolean = false;
  errorMessage!: string;
  validateEmailFrom!: FormGroup;
  validateTokenForm!: FormGroup;
  validEmail: boolean = false;
  sumbitting: boolean = false;
  btnValue: string = 'Enviar código';

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.validateEmailFrom = this.fb.group({
      current_email: ['', [Validators.required, Validators.email]],
      new_email: ['', [Validators.required, Validators.email]],
    });

    this.validateEmailFrom.get('current_email')?.setErrors({ invalidEmail: false });

    this.validateTokenForm = this.fb.group({
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
          this.unknowError = false;
          this.errorMessage = "";
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
          } else {
            this.validEmail = false;
            this.unknowError = true;
            this.errorMessage = 'Error inesperado, intente nuevamente';
            this.validateEmailFrom.reset();
            this.validateTokenForm.reset();
          }
        }
      });
    }
  }

  validateToken() {
    this.sumbitting = true;
    if(this.validateTokenForm.valid) {
      const { token } = this.validateTokenForm.value;
      const formData = new FormData();
      formData.append('token', token);
      this.userService.validateToken(formData).subscribe({
        next: (res: Message) => {
          this.unknowError = false;
          this.errorMessage = "";
          this.sumbitting = false;
          this.validEmail = false;
          this.btnValue = 'Enviar código';
          this.toastr.success('Email actualizado con éxito', 'Cambio de email', {
            timeOut: 15000,
            progressBar: true, 
          });
          const refresh = this.authService.refreshToken();
          
          const newUserData = this.authService.updateDomEmail(this.validateEmailFrom.get('new_email')?.value);
          this.validateEmailFrom.reset();
          this.validateTokenForm.reset();
          this.emitUser.emit(newUserData);
        },
        error: (error: HttpErrorResponse) => {
          this.sumbitting = false;
          if (error.status === 422 && error.error && error.error.error) {
            const noExists = error.error.error.token;
            if(noExists != undefined && noExists[0] === 'El código de confirmación no existe') {
              this.validateTokenForm.get('token')?.setErrors({ invalidToken: true });
            } else {
              // Otros posibles errores del backend
              this.toastr.error(noExists, 'Error', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            }
            const expired = error.error.error;
            if(expired === 'El código de confirmación ya expiro, debes generar otro') {
              this.validEmail = false;
              this.unknowError = true;
              this.errorMessage = 'El código de confirmación ya expiro, debes generar otro';
            }
          } else {
            this.validEmail = false;
            this.unknowError = true;
            this.errorMessage = 'Error inesperado, intente nuevamente';
            this.validateEmailFrom.reset();
            this.validateTokenForm.reset();
          }
        }
      });
    }
  }
}
