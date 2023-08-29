import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronRight, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PetImage } from 'src/app/protected/dashboard/my-pets/interfaces/pet.image.interface';
import { Pet } from 'src/app/protected/dashboard/my-pets/interfaces/pet.interface';
import { PetService } from 'src/app/protected/dashboard/my-pets/services/pet.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.component.html',
  styleUrls: ['./pet-profile.component.scss']
})
export class PetProfileComponent {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  user: User|null;

  petForm!: FormGroup;
  selectedImage: string | null = null;
  unknowError: boolean = false;
  errorMessage!: string;
  submitting: boolean = false;
  btnValue: string = 'Siguiente';

  constructor(
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private petService: PetService,
    private fb: FormBuilder,
  ){
    this.user = this.authService.getUser();
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
      birth_date: [''],
      race: ['', [Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
      gender: ['', [Validators.required, this.genderValidation]],
      pet_information: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
      image: [null],
    });
  }

  genderValidation(control: FormControl) {
    const value = control.value.toLowerCase();
    if(value === 'male' || value === 'female') {
      return null;
    } else {
      return {invalidGender: true}
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.petForm.patchValue({
        image: file,
      });
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onInputChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.trim() !== '') {
      input.classList.add('has-content');
    } else {
      input.classList.remove('has-content');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.petForm.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.petForm.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }

  getErrorMessage(fieldName: string): string {
    const formControl = this.petForm.get(fieldName);
    if (!formControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(formControl.errors)[0];
    return this.formValidationService.getErrorMessage(errorKey, formControl.errors[errorKey]);
  }

  createPet() {
    this.submitting = true;
    this.unknowError = false;
    const oldBtnValue = this.btnValue;
    const { name, birth_date, race, gender, pet_information, image } = this.petForm.value; 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birth_date', birth_date);
    formData.append('race', race);
    formData.append('gender', gender);
    formData.append('pet_information', pet_information);

    this.petService.createPet(formData).subscribe({
      next: (res: Pet) => {
        const petId = res.id.toString();
        const imageFormData = new FormData();
        imageFormData.append('pet_id', petId);
        imageFormData.append('image', this.petForm.get('image')?.value);
        imageFormData.append('cover_image', '1');
        this.petService.createImage(imageFormData).subscribe({
          next: (res: PetImage) => {
            this.submitting = false;
            this.unknowError = false;
            console.log(res);
            
          },
          error: (error: HttpErrorResponse) => {
            this.submitting = false;
            this.unknowError = true;
            this.errorMessage = 'Ocurrió un error al subir la imagen de la mascota.';
            this.btnValue = oldBtnValue;
            
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.submitting = false;
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al crear el perfíl de la mascota.';
        this.btnValue = oldBtnValue;
        console.log(error.error);
        
      }
    })
  }
}
