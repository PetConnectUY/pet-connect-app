import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronRight, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { catchError, map, of, switchMap, throwError } from 'rxjs';
import { Pet } from 'src/app/protected/pets/interfaces/pet.interface';
import { PetRace } from 'src/app/protected/pets/interfaces/pet.race.interface';
import { PetService } from 'src/app/protected/pets/services/pet.service';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { TokenService } from 'src/app/shared/services/token.service';

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
  @Output() eventPetId: EventEmitter<number> = new EventEmitter<number>();

  user: User|null;

  petForm!: FormGroup;
  selectedImage: string | null = null;
  unknowError: boolean = false;
  errorMessage!: string;
  submitting: boolean = false;
  btnValue: string = 'Siguiente';

  races: PetRace[] = [];
  token: string | null;
  petId!: number;

  constructor(
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private petService: PetService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private qrActivateService: QRActivationService,
    private router: Router,
  ){
    this.user = this.authService.getUser();
    this.token = this.tokenService.getToken();
    this.petService.getRaces().subscribe({
      next: (res: PetRace[]) => {
        this.races = res;
      },
      error: (error: HttpErrorResponse) => {
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al obtener las razas.';
      }
    });
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
      birth_date: [''],
      race_id: ['',],
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
    const { name, birth_date, race_id, gender, pet_information, image } = this.petForm.value; 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birth_date', birth_date);
    formData.append('race_id', race_id);
    formData.append('gender', gender);
    formData.append('pet_information', pet_information);
  
    const petImage = this.petForm.get('image')?.value as File | null;
    if (!petImage) {
      this.submitting = false;
      this.unknowError = true;
      this.errorMessage = 'Por favor, selecciona una imagen para la mascota.';
      return;
    }
  
    this.petService.createPet(formData).pipe(
      switchMap((res: Pet) => {
        this.petId = res.id;
        const imageFormData = new FormData();
        imageFormData.append('pet_id', this.petId.toString());
        imageFormData.append('image', this.petForm.get('image')?.value);
        imageFormData.append('cover_image', '1');
        
        // Realiza la solicitud para crear la imagen de la mascota
        return this.petService.createImage(imageFormData).pipe(
          catchError((error: HttpErrorResponse) => {
            // Manejo de errores relacionados con la imagen
            return throwError('Ocurrió un error al subir la imagen de la mascota.');
          })
        );
      }),
      switchMap(() => {
        // Realiza la asignación de la mascota al código QR
        if (this.token) {
          return this.qrActivateService.setPetToToken(this.petId).pipe(
            map(() => 'Mascota asignada al código QR con éxito')
          );
        } else {
          return of('Mascota creada con éxito, pero no se asignó al código QR');
        }
      }),
      catchError((error: HttpErrorResponse) => {        
        // Manejo de errores relacionados con la asignación al código QR
        return throwError('Ocurrió un error al asignar el código QR a la mascota.');
      })
    ).subscribe({
      next: (message: string) => {
        this.submitting = false;
        this.unknowError = false;
        
        if(this.token) {
          // Emitir el evento 'next' solo si la asignación se realizó con éxito
          if (message === 'Mascota asignada al código QR con éxito') {      
            this.eventPetId.emit(this.petId);      
            this.next.emit();
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: string) => {
        this.submitting = false;
        this.unknowError = true;
        this.errorMessage = error;
      }
    });
  }
}
