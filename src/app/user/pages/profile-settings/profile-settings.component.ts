import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronRight, faExclamationCircle, faPaw, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { Pet } from 'src/app/protected/dashboard/my-pets/interfaces/pet.interface';
import { PetService } from 'src/app/protected/pets/services/pet.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  faExclamationCircle = faExclamationCircle;
  faUser = faUser;
  faPaw = faPaw;
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  btnValue: string = 'Siguiente';
  submitting: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;

  nameVisible: number = 1;
  locationVisible: number = 1;
  contactPhone: number = 1;
  contactMail: number = 1;

  profileSettingsForm!: FormGroup;

  @Input() petId!: number | undefined;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private petService: PetService,
    private router: Router,
  ) {
    this.profileSettingsForm = this.fb.group({
      user_fullname_visible: [this.nameVisible, [Validators.required]],
      user_location_visible: [this.locationVisible, [Validators.required]],
      user_phone_visible: [this.contactPhone, [Validators.required]],
      user_email_visible: [this.contactMail, [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.profileSettingsForm.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.profileSettingsForm.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.profileSettingsForm.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }

  changeSettings() {
    this.unknowError = false;
    this.submitting = true;
    const oldBtnValue = this.btnValue;
    if(this.profileSettingsForm.valid) {
      const {user_fullname_visible, user_location_visible, user_phone_visible, user_email_visible} = this.profileSettingsForm.value;
      const formData = new FormData();
      formData.append('user_fullname_visible', user_fullname_visible ? '1' : '0');
      formData.append('user_location_visible', user_location_visible ? '1' : '0');
      formData.append('user_phone_visible', user_phone_visible ? '1' : '0');
      formData.append('user_email_visible', user_email_visible ? '1' : '0');
      
      this.petService.changeSettings(this.petId, formData).subscribe({
        next: (res: Pet) => {
          this.router.navigate([`/pets/${this.petId}`]);
        },
        error: (error: HttpErrorResponse) => {
          this.submitting = false;
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al guardar la configuración';
          this.btnValue = oldBtnValue;
        }
      });
    }
  }
}
