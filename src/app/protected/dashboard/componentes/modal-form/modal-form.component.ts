import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pet } from '../../../pets/interfaces/pet.interface';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PetService } from '../../../pets/services/pet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PetImage } from '../../../pets/interfaces/pet.image.interface';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;

  @Input() petToEdit!: Pet;
  @Output() emitPet: EventEmitter<Pet> = new EventEmitter();
  @Output() emitPetImage: EventEmitter<PetImage> = new EventEmitter();
  @Output() emitAtCreate: EventEmitter<{pet: Pet, image: PetImage}> = new EventEmitter();

  petForm!: FormGroup;

  modalTitle!: string;
  modalBtnTitle!: string;
  submitting: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;
  btnValue!: string;
  selectedImage: string | null = null;

  fieldHasContent: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private formValidationService: FormValidationService,
    private petService: PetService,
  ) {}

  ngOnInit(): void {
    if(this.petToEdit) {      
      this.modalTitle = "Editar datos de "+ this.petToEdit.name;
      this.btnValue = "Actualizar";
      this.petForm = this.fb.group({
        name: [this.petToEdit.name, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
        birth_date: [this.petToEdit.birth_date, []],
        race: [this.petToEdit.race, [Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
        gender: [this.petToEdit.gender, [Validators.required, this.genderValidation]],
        pet_information: [this.petToEdit.pet_information, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
        image: [null]
      });
      Object.keys(this.petForm.controls).forEach(controlName => {
        const control = this.petForm.get(controlName);
        if (control && control.value) {
            this.fieldHasContent[controlName] = control.value.trim() !== '';
        }
      });
      if (this.petToEdit.images.length > 0) {
        this.selectedImage = this.petToEdit.images[0].url;
      }
    } else {
      this.modalTitle = 'Crear nueva mascota';
      this.btnValue = 'Crear';
      this.petForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
        birth_date: ['', []],
        race: ['', [Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
        gender: ['', [Validators.required, this.genderValidation]],
        pet_information: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
        image: [null]
      });
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

  hasContent(controlName: string): boolean {
    const controlValue = this.petForm.get(controlName)?.value;
    return controlValue ? controlValue.trim() !== '' : false;
  } 

  genderValidation(control: FormControl) {
    const value = control.value ? control.value.toLowerCase() : null;
    if(value === 'male' || value === 'female') {
        return null;
    } else {
        return { invalidGender: true };
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

  save() {
    if(this.petForm.valid) {
      this.submitting = true;
      this.unknowError = false;
      const oldBtnValue = this.btnValue;
      const { name, birth_date, race, gender, pet_information } = this.petForm.value;

      const formData = new FormData();

      formData.append('name', name);
      formData.append('birth_date', birth_date);
      formData.append('race', race);
      formData.append('gender', gender);
      formData.append('pet_information', pet_information);

      if(this.petToEdit) { 
        this.petService.updatePet(formData, this.petToEdit.id).subscribe({
          next: (res: Pet) => {
            this.emitPet.emit(res);
            const imageFormData = new FormData();
            imageFormData.append('image', this.petForm.get('image')?.value);
            if(this.selectedImage && this.petToEdit.images.length > 0) {
              this.petService.updateImage(imageFormData, res.images[0].id).subscribe({
                next: (image: PetImage) => {
                  this.emitPetImage.emit(image);
                  this.unknowError = false;
                  this.submitting = false;
                  this.closeModal();
                },
                error: (error: HttpErrorResponse) => {
                  this.btnValue = oldBtnValue;
                  this.unknowError = true;
                  this.submitting = false;
                  this.errorMessage = 'Ocurrió un error al actualizar la imagen.';
                }
              });
            } else if (this.selectedImage) {
              imageFormData.append('pet_id', res.id.toString());
              imageFormData.append('cover_image', '1');
              this.petService.createImage(imageFormData).subscribe({
                next: (image: PetImage) => {
                  this.emitPetImage.emit(image);
                  this.unknowError = false;
                  this.submitting = false;
                  this.closeModal();
                },
                error: (error: HttpErrorResponse) => {
                  this.btnValue = oldBtnValue;
                  this.unknowError = true;
                  this.submitting = false;
                  this.errorMessage = 'Ocurrió un error al subir la nueva imagen.';
                }
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.btnValue = oldBtnValue;
            this.unknowError = true;
            this.errorMessage = 'Ocurrió un error al actualizar tu mascota.';
          }
        })
      } else {
        this.petService.createPet(formData).subscribe({
          next: (res: Pet) => {
            this.emitPet.emit(res);
            const imageFormData = new FormData();
            imageFormData.append('image', this.petForm.get('image')?.value);
            if(this.selectedImage) {
              imageFormData.append('pet_id', res.id.toString());
              imageFormData.append('cover_image', '1');
              this.petService.createImage(imageFormData).subscribe({
                next: (image: PetImage) => {
                  this.emitAtCreate.emit({ pet: res, image: image });
                  this.unknowError = false;
                  this.submitting = false;
                  this.closeModal();
                },
                error: (error: HttpErrorResponse) => {
                  this.btnValue = oldBtnValue;
                  this.unknowError = true;
                  this.submitting = false;
                  this.errorMessage = 'Ocurrió un error al subir la nueva imagen.';
                }
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.btnValue = oldBtnValue;
            this.unknowError = true;
            this.errorMessage = 'Ocurrió un error al crear tu mascota.';
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
