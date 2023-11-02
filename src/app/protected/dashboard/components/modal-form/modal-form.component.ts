import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pet } from '../../../pets/interfaces/pet.interface';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PetService } from '../../../pets/services/pet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PetImage } from '../../../pets/interfaces/pet.image.interface';
import { PetRace } from 'src/app/protected/pets/interfaces/pet.race.interface';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit, OnDestroy {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;

  @Input() petToEdit!: Pet;
  @Input() loadingRaces: boolean = false;
  @Input() races!: PetRace[];
  @Output() emitPet: EventEmitter<Pet> = new EventEmitter();
  @Output() emitPetImage: EventEmitter<PetImage> = new EventEmitter();
  @Output() emitAtCreate: EventEmitter<{pet: Pet, image: PetImage}> = new EventEmitter();

  public raceCtrl: FormControl = new FormControl();
  public raceFilterCtrl: FormControl = new FormControl();
  public filteredRaces: ReplaySubject<PetRace[]> = new ReplaySubject<PetRace[]>(1);

  @ViewChild('raceSelect') raceSelect!: MatSelect;
  protected _onDestroyRace = new Subject<void>();

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
        race_id: [this.petToEdit ? this.petToEdit.race.id : this.races[0].id, [Validators.required]],
        gender: [this.petToEdit.gender, [Validators.required, this.genderValidation]],
        pet_information: [this.petToEdit.pet_information, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
        image: [null],
        type: [this.petToEdit.type],
      });
      Object.keys(this.petForm.controls).forEach(controlName => {
        const control = this.petForm.get(controlName);
        if (control) {
          const controlValue = control.value;
          if (typeof controlValue === 'string') {
            this.fieldHasContent[controlName] = controlValue.trim() !== '';
          }
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
        race_id: ['', [Validators.required]],
        gender: ['', [Validators.required, this.genderValidation]],
        pet_information: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
        image: [null],
        type: [''],
      });
    }
    this.getRaces();
  }

  ngOnDestroy(): void {
    this._onDestroyRace.next();
    this._onDestroyRace.complete();
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

  getRaces() {
    this.loadingRaces = true;
    this.petService.getRaces(this.petToEdit.type).subscribe(res => {
      this.races = res;
      this.raceCtrl.setValue(this.races);
      this.filteredRaces.next(this.races.slice());
      this.raceFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyRace))
        .subscribe(() => {
          this.filterRaces();
        });
        this.raceCtrl.setValue(this.petToEdit.race.id);
        this.loadingRaces = false;
    }, error => {
      this.loadingRaces = false;
      this.unknowError = true;
      this.errorMessage = 'Ocurrió un error al obtener las razas.';
    })
  }

  onRaceChange() {
    this.petForm.controls['race_id'].setValue(this.raceCtrl.value);
  }

  protected filterRaces() {
    if (!this.races) {
        return;
    }
    let search = this.raceFilterCtrl.value;
    if (!search) {
        this.filteredRaces.next(this.races.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    this.filteredRaces.next(
        this.races.filter(race => race.name.toLocaleLowerCase().indexOf(search) > -1)
    );
  }

  hasContent(controlName: string): boolean {
    const control = this.petForm.get(controlName);
    if (control) {
      const controlValue = control.value;
      if (typeof controlValue === 'string') {
        return controlValue.trim() !== '';
      }
    }
    return false;
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
      const { name, birth_date, race_id, gender, pet_information, type } = this.petForm.value;

      const formData = new FormData();

      formData.append('name', name);
      formData.append('birth_date', birth_date);
      formData.append('race_id', race_id);
      formData.append('gender', gender);
      formData.append('pet_information', pet_information);
      formData.append('type', type);

      if(this.petToEdit) { 
        this.petService.updatePet(formData, this.petToEdit.id).subscribe({
          next: (res: Pet) => {
            this.emitPet.emit(res);
            const imageFormData = new FormData();
            imageFormData.append('image', this.petForm.get('image')?.value);
            if(this.selectedImage) {
              if(this.petToEdit.images.length > 0 && this.petForm.get('image')?.value !== null) {
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
              }
            } else {
              this.unknowError = false;
              this.submitting = false;
              this.closeModal();
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
              console.log(this.selectedImage);
              
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
