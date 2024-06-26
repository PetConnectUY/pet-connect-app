import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { faExclamationCircle, faEye, faEyeSlash, faSpinner, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { NominatimService } from 'src/app/shared/services/nominatim.service';
import { Subject, of, throwError } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Message } from '../../interfaces/message.interface';
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-google-signup',
  templateUrl: './google-signup.component.html',
  styleUrls: ['./google-signup.component.scss']
})
export class GoogleSignupComponent {
  faExclamationCircle = faExclamationCircle;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  signupForm!: FormGroup;
  startDate = new Date(2005, 0, 1);
  loaderForEmailExists: boolean = false;
  emailExists: boolean = false;
  addressSuggestions: any[] = [];
  selectingSuggestion = false;
  user: User | null;
  
  hide!: boolean;
  showLoader = true;
  show: boolean = false;
  submitting: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;
  btnValue: string = 'Siguiente';
  private destroy$ = new Subject<void>();

  token!: string | null;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private formValidationService: FormValidationService,
    private nominatimService: NominatimService,
    private tokenService: TokenService,
    private qrActivationService: QRActivationService,
  ) {
    this.user = this.authService.getUser();
    this.signupForm = this.fb.group({
      firstname: [this.user ? this.user?.firstname : '', [Validators.required, Validators.minLength(3), Validators.maxLength(16), Validators.pattern("^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$")]],
      lastname: [this.user ? this.user?.lastname : '', [Validators.required, Validators.minLength(3), Validators.maxLength(16), Validators.pattern("^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$")]],
      email: [this.user ? this.user?.email : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Z]).{6,}$")]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]{8,}$")]],
      address: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
    });
    // this.token = this.tokenService.getToken();
  }

  ngOnInit(): void {
      this.signupForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.validateEmail();
      });

      this.signupForm.get('address')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (this.selectingSuggestion) {
            this.selectingSuggestion = false;
            return [];
          } else {
            return this.nominatimService.getAddressSuggestions(value);
          }
        })
      )
      .subscribe((suggestions: string[]) => {
        this.addressSuggestions = suggestions;
      });

      this.setMinDate();
  }

  ngAfterViewInit(): void {
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.signupForm.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.signupForm.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.signupForm.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }

  validateEmail(): void {
    const emailControl = this.signupForm.get('email');
    if (emailControl?.valid) {
      this.loaderForEmailExists = true;
      this.userService.checkEmailExists(emailControl.value).then((exists) => {
        this.emailExists = exists;
        this.loaderForEmailExists = false;
      });
    } else {
      this.emailExists = false;
      this.loaderForEmailExists = false;
    }
  }

  toggleShow() {
    this.show = !this.show;
  }

  selectAddressSuggestion(suggestion: string): void {
    this.signupForm.get('address')?.setValue(suggestion);
    this.addressSuggestions = [];
    this.selectingSuggestion = true;
  }

  setMinDate(): void {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 12);
  
    this.signupForm.get('birth_date')?.setValidators([this.formValidationService.minDateValidator(currentDate)]);
    this.signupForm.get('birth_date')?.updateValueAndValidity();
  }

  register() {
    this.submitting = true;
    this.unknowError = false;
    const oldBtnValue = this.btnValue;

    const { firstname, lastname, email, password, phone, address, birth_date } = this.signupForm.value;
    const formData = new FormData();
    this.recaptchaV3Service.execute('save').subscribe((token) => {
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('birth_date', new Date(birth_date).toISOString().split('T')[0]);
      formData.append('g-recaptcha-response', token);
      
      if(this.signupForm.valid) {
        this.userService.updateGoogleRegistration(formData, this.user!.id).pipe(
          switchMap((res: User) => {
            return this.authService.login(email, password).pipe(
              switchMap((loginResult: AuthResponse) => {
                this.router.navigateByUrl('/dashboard');
                return of(null);
              }),
              catchError((error: HttpErrorResponse) => {
                // Manejo de errores al iniciar sesión
                this.unknowError = true;
                this.submitting = false;
                this.errorMessage = 'Ocurrió un error al iniciar sesión de forma automática.';
                return throwError(error);
              })
            );
          }),
          catchError((error: HttpErrorResponse) => {
            // Manejo de errores al registrar al usuario
            this.submitting = false;
            this.unknowError = true;
            this.errorMessage = 'Ocurrió un error al registrar el usuario.';
            return throwError(error.error);
          })
        ).subscribe();
      }
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}
