import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle, faIdBadge, faPaw, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { Pet } from '../../interfaces/pet.interface';
import { PetService } from '../../services/pet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Message } from 'src/app/user/interfaces/message.interface';

@Component({
  selector: 'app-pet-found-modal',
  templateUrl: './pet-found-modal.component.html',
  styleUrls: ['./pet-found-modal.component.scss'],
})
export class PetFoundModalComponent implements OnInit {
  faIdBadge = faIdBadge;
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;
  faPaw = faPaw;

  @Input() token!: string;
  @Input() pet!: Pet;

  user: User | null;
  captchaToken!: string;
  petFoundForm!: FormGroup;
  

  fieldHasContent: { [key: string]: boolean } = {};
  submitting: boolean = false;
  btnValue: string = 'Contactar';
  unknowError: boolean = false;
  errorMessage!: string;
  showSuccessMessage = false;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private petService: PetService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ){
    this.user = this.authService.getUser();
    this.petFoundForm = this.fb.group({
      firstname: [this.user ? this.user.firstname : '', [Validators.minLength(3), Validators.maxLength(16)]],
      email: [this.user ? this.user.email : '', [Validators.email]],
      phone: [this.user ? this.user.phone : '', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]{8,}$")]],
    });

    Object.keys(this.petFoundForm.controls).forEach(controlName => {
      const control = this.petFoundForm.get(controlName);
      if (control && control.value) {
          this.fieldHasContent[controlName] = control.value.trim() !== '';
      }
    });
  }
  ngOnInit(): void {
  }

  hasContent(controlName: string): boolean {
    const controlValue = this.petFoundForm.get(controlName)?.value;
    return controlValue ? controlValue.trim() !== '' : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.petFoundForm.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.petFoundForm.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.petFoundForm.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }

  save(){
    this.unknowError = false;
    this.submitting = true;
    this.showSuccessMessage = false;
    const { firstname, phone, email } = this.petFoundForm.value;
    const formData = new FormData();

    this.recaptchaV3Service.execute('save').subscribe((token) => {
      formData.append('firstname', firstname);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('g-recaptcha-response', token);
      this.petService.petFound(this.token, formData).subscribe({
        next: (res: Message) => {
          this.submitting = false;
          this.showSuccessMessage = true;
        },
        error: (error: HttpErrorResponse) => {
          this.submitting = false;
          this.showSuccessMessage = false;
          this.unknowError = true;
          this.errorMessage = error.error;
        }
      });
    });
  }

  closeModal(){
    this.activeModal.close();
  }
}
