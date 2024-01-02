import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  changePasswordForm!: FormGroup;
  hide: boolean = false;
  passwordsMatch: boolean = false;
  submittingChangePassword: boolean = false;
  btnValue: string = 'Guardar los cambios';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])/), // Al menos una letra mayúscula
        ],
      ],
      confirm_password: ['', [Validators.required]],
    });
    
    this.changePasswordForm.valueChanges.subscribe(() => {
      const currentPassword = this.changePasswordForm.get('current_password')?.value;
      const newPassword = this.changePasswordForm.get('new_password')?.value;
      const confirmPassword = this.changePasswordForm.get('confirm_password')?.value;
      if (newPassword.trim() !== '' && confirmPassword.trim() !== '') {      
        if (newPassword === confirmPassword) {
          // Si las contraseñas coinciden, eliminar el error en el campo de confirmación de la contraseña
          this.changePasswordForm.get('confirm_password')?.setErrors(null);
        } else {
          // Si las contraseñas no coinciden, establecer un error en el campo de confirmación de la contraseña
          this.changePasswordForm.get('confirm_password')?.setErrors({ passwordsNotMatch: true });
        }
      }  
      
      if(currentPassword.trim() !== '' && newPassword.trim() !== '') {
        if(currentPassword === newPassword) {
          this.changePasswordForm.get('current_password')?.setErrors({ passwordsNotMatch: true });
        } else {
          this.changePasswordForm.get('current_password')?.setErrors(null);
        }
      }
    });
  }

  changePassword() {
    this.submittingChangePassword = true;
    const formData = new FormData();
    const { current_password, new_password, confirm_password } = this.changePasswordForm.value;
    formData.append('current_password', current_password);
    formData.append('new_password', new_password);
    formData.append('confirm_password', confirm_password);
    
    if(this.changePasswordForm.valid) {
      this.userService.changePassword(formData).subscribe({
        next: (res: User) => {
          this.authService.refreshToken().subscribe({
            next: (res: AuthResponse) => {
              this.submittingChangePassword = false;
              this.toastr.success('Contraseña cambiada con éxito', 'Éxito!', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            },
            error: (error: HttpErrorResponse) => {
              this.authService.logout();
              window.location.reload();
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submittingChangePassword = false;
          // Manejo de errores del backend
          if (error.status === 422 && error.error && error.error.error) {
            // 422 Unprocessable Entity - Validación fallida
            const backendError = error.error.error;
            if (backendError === 'La contraseña actual no es válida') {
              this.changePasswordForm.get('current_password')?.setErrors({ invalidCurrentPassword: true });
            } else {
              // Otros posibles errores del backend
              this.toastr.error(backendError, 'Error', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
              });
            }
          } else {
            // Otros errores no relacionados con la validación
            this.toastr.error('Ocurrió un error al cambiar la contraseña.', 'Error', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
            });
          }
        }
      });
    }
  }

  public togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
