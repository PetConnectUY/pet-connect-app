import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { faExclamationCircle, faEye, faEyeSlash, faSpinner, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  faExclamationCircle = faExclamationCircle;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  signupForm!: FormGroup;
  loaderForEmailExists: boolean = false;
  emailExists: boolean = false;
  addressSuggestions: any[] = [];

  showLoader = true;
  show: boolean = false;
  submitting: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;
  btnValue: string = 'Siguiente';
  hide!: boolean;
  private destroy$ = new Subject<void>();

  token!: string | null;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private nominatimService: NominatimService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16), Validators.pattern("^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$")]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16), Validators.pattern("^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Z]).{6,}$")]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]{8,}$")]],
      address: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.signupForm.get('address')?.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: string) => {
          return this.nominatimService.getAddressSuggestions(value);
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

  toggleShow() {
    this.show = !this.show;
  }

  selectAddressSuggestion(suggestion: string): void {
    this.signupForm.get('address')?.setValue(suggestion, {});
    this.addressSuggestions = [];
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
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('birth_date', new Date(birth_date).toISOString());
      formData.append('g-recaptcha-response', token);
      
      if(this.signupForm.valid) {
        this.userService.register(formData).pipe(
          switchMap((res: User) => {
            return this.authService.login(email, password).pipe(
              switchMap((loginResult: AuthResponse) => {
                this.next.emit();
                return of(null);
              }),
              catchError((error: HttpErrorResponse) => {
                this.unknowError = true;
                this.submitting = false;
                this.errorMessage = 'Ocurrió un error al iniciar sesión de forma automática.';
                return throwError(error);
              })
            );
          }),
          catchError((error: any) => {
            if (error.error) {
              Object.keys(error.error).forEach(field => {                
                const formControl = this.signupForm.get(field);
                if (formControl) {
                  formControl.setErrors({ serverError: error.error[field][0] });
                }
                this.submitting = false;
              });
            } else {
              this.unknowError = true;
              this.submitting = false;
              this.errorMessage = 'Ocurrió un error al registrar el usuario.';
            }
            return throwError(error);
          })
        ).subscribe({
          next: (res) => {
            const redirectUrl = this.route.snapshot.queryParams['redirect_url'] || '/dashboard';
            this.router.navigateByUrl(redirectUrl);
          }
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}
