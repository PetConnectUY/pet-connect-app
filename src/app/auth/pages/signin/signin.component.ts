import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faExclamationCircle, faSpinner, faEye, faEyeSlash, faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faQrCode = faQrcode;
  faTriangleExclamation = faTriangleExclamation;

  showLoader = true;
  hide: boolean = false;
  user: User|null;

  signinForm!: FormGroup;
  show: boolean = false;
  submitting: boolean = false;
  btnValue: string = 'Ingresar';
  unknowError: boolean = false;
  errorMessage!: string;
  invalidCredentials: boolean = false;
  token!: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private formValidationService: FormValidationService,
  ) {
    this.user = this.authService.getUser();
    this.signinForm = this.fb.group({
      email: [this.user?this.user.email: '', [this.emailValidator(this.user)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  emailValidator = (user: User | null) => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (user) {
        return null;
      } else {
        return Validators.required(control);
      }
    };
  };

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.signinForm.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.signinForm.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.signinForm.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }
  
  public togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
  
  login() {
    if(this.signinForm.valid) {
      this.invalidCredentials = false;
      this.unknowError = false;
      const oldBtnValue = this.btnValue;
      this.startSubmittingForm();
      const { email, password } = this.signinForm.value;
      try {
        this.authService.login(email, password).subscribe({
          next: (res: any) => {
            if (res.error) {
              this.invalidCredentials = true;
              this.endSubmittingForm(oldBtnValue);
            } else {
              const redirectUrl = this.route.snapshot.queryParams['redirect_url'] || '/dashboard';
              this.router.navigateByUrl(redirectUrl);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.unknowError = true;
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.';
            this.endSubmittingForm(oldBtnValue);
          }
        });
      } catch (error) {
        this.unknowError = true;
        this.endSubmittingForm(oldBtnValue);
      }
    } else {
      this.unknowError = true;
      this.errorMessage = 'Los campos son inválidos, reviselos.';
    }
  }

  startSubmittingForm() {
    this.submitting = true;
    this.btnValue = "";
  }
  
  endSubmittingForm(btnValue: string) {
    this.submitting = false;
    this.btnValue = btnValue;
  }

  removeAccount() {
    this.authService.clearStorage();
    this.user = null;
  } 

  toggleShow() {
    this.show = !this.show;
  }

}
