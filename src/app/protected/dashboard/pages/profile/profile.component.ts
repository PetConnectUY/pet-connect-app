import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheckCircle, faChevronRight, faExclamationCircle, faExclamationTriangle, faGears, faPaw, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { UserPetProfileSetting } from 'src/app/user/interfaces/user-pet-profile-setting.interface';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  faGears = faGears;
  faExclamationTriangle = faExclamationTriangle;
  faExclamationCircle = faExclamationCircle;
  faUser = faUser;
  faPaw = faPaw;
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;
  faChevronRight = faChevronRight;

  user!: User|null;
  loader: boolean = false;
  btnValue: string = 'Guardar los cambios';
  submitting: boolean = false;
  submittingChangePassword: boolean = false;
  successSubmittion: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;

  changePasswordForm!: FormGroup;
  settingsForm!: FormGroup;
  profileSettings!: FormGroup;

  hide: boolean = false;
  passwordsMatch: boolean = false;

  nameVisible!: boolean;
  locationVisible!: boolean;
  contactPhone!: boolean;
  contactMail!: boolean;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private userService: UserService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private toastr: ToastrService
  ){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.user = this.authService.getUser();    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {    
    this.settingsForm = this.fb.group({
      user_fullname_visible: [this.nameVisible, [Validators.required]],
      user_location_visible: [this.locationVisible, [Validators.required]],
      user_phone_visible: [this.contactPhone, [Validators.required]],
      user_email_visible: [this.contactMail, [Validators.required]],
    });

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

    // this.loader = true;
    // this.userService.getSettings().subscribe({
    //   next: (res: UserPetProfileSetting) => {
    //     this.nameVisible = res.user_fullname_visible;
    //     this.locationVisible = res.user_location_visible;
    //     this.contactPhone = res.user_phone_visible;
    //     this.contactMail = res.user_email_visible;
    //     this.loader = false;
    //     this.settingsForm.patchValue({
    //       user_fullname_visible: this.nameVisible,
    //       user_location_visible: this.locationVisible,
    //       user_phone_visible: this.contactPhone,
    //       user_email_visible: this.contactMail,
    //     });
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.loader = false;
    //     this.unknowError = true;
    //     this.errorMessage = 'Ocurrió un error al obtener la configuración del usuario.';
    //   }
    // });
  }
  
  changeSettings() {
    this.successSubmittion = false;
    const oldBtnValue = this.btnValue;
    this.submitting = true;
    this.unknowError = false;
    const { user_fullname_visible, user_location_visible, user_phone_visible, user_email_visible } = this.settingsForm.value;
    const formData = new FormData();
    formData.append('user_fullname_visible', user_fullname_visible ? '1' : '0');
    formData.append('user_location_visible', user_location_visible ? '1' : '0');
    formData.append('user_phone_visible', user_phone_visible ? '1' : '0');
    formData.append('user_email_visible', user_email_visible ? '1' : '0');
    this.userService.changeSettings(formData).subscribe({
      next: (res: UserPetProfileSetting) => {
        this.loader = false;
        this.unknowError = false;
        this.submitting = false;
        this.successSubmittion = true;
        this.btnValue = 'Cambios guardados';
        
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        
        this.btnValue = oldBtnValue;
        this.loader = false;
        this.submitting = false;
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al guardar los cambios.';
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
