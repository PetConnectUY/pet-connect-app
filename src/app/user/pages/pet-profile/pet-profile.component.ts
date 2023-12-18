import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faChevronRight, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, switchMap, throwError, map, takeUntil, take, forkJoin } from 'rxjs';
import { Pet } from 'src/app/protected/pets/interfaces/pet.interface';
import { PetRace } from 'src/app/protected/pets/interfaces/pet.race.interface';
import { PetService } from 'src/app/protected/pets/services/pet.service';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.component.html',
  styleUrls: ['./pet-profile.component.scss']
})
export class PetProfileComponent implements OnDestroy {
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

  pets: Pet[] = [];
  races: PetRace[] = [];
  token: string | null;
  petId!: number;
  hasToken: boolean = false;
  petSelected: boolean = false;
  loadingRaces: boolean = false;

  public petType: FormControl = new FormControl();
  
  public raceCtrl: FormControl = new FormControl();
  public raceFilterCtrl: FormControl = new FormControl();
  public filteredRaces: ReplaySubject<PetRace[]> = new ReplaySubject<PetRace[]>(1);

  public petCtrl: FormControl = new FormControl();
  public petFilterCtrl: FormControl = new FormControl();
  public filteredPets: ReplaySubject<Pet[]> = new ReplaySubject<Pet[]>(1);

  @ViewChild('raceSelect') raceSelect!: MatSelect;
  @ViewChild('petSelect') petSelect!: MatSelect;

  protected _onDestroyRace = new Subject<void>();
  protected _onDestroyPet = new Subject<void>();

  constructor(
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private petService: PetService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private qrActivationService: QRActivationService,
  ){
    this.token = this.tokenService.getCookie();
    this.user = this.authService.getUser();
    this.raceCtrl.disable();

    this.route.queryParamMap.subscribe((res) => {
      if(res.has('hasToken')) {
        this.hasToken = true;
      }
    });

    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u)]],
      type: [this.petType.value, [Validators.required]],
      birth_date: [''],
      race_id: ['', [Validators.required]],
      gender: ['', [Validators.required, this.genderValidation]],
      pet_information: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZñÑáÁéÉíÍóÓúÚüÜ\s\d.,!?-]*$/)]],
      image: [null],
    });
  }

  protected getRaces() {
    this.petForm.controls['type'].setValue(this.petType.value);
    this.petType.disable();
      this.loadingRaces = true;
      this.petService.getRaces(this.petType.value).subscribe({
        next: (res: PetRace[]) => {
          this.races = res;
          this.raceCtrl.setValue(this.races);
          this.filteredRaces.next(this.races.slice());
          this.raceFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyRace))
            .subscribe(() => {
              this.filterRaces();
            });
            this.loadingRaces = false;
            this.raceCtrl.enable();
            this.petType.enable();
        },
        error: (error: HttpErrorResponse) => {
          this.loadingRaces = false;
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al obtener las razas.';
        }
    });
  }

  ngOnDestroy(): void {
    this._onDestroyRace.next();
    this._onDestroyRace.complete();
    this._onDestroyPet.next();
    this._onDestroyPet.complete();
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

  onPetChange() {
    if(this.petCtrl.value != undefined) {
      this.petSelected = true;
      this.raceCtrl.disable();
      this.petForm.disable();
    } else {
      this.petSelected = false;
      this.petForm.enable();
      this.raceCtrl.enable();
    }
  }

  onRaceChange() {
    this.petForm.controls['race_id'].setValue(this.raceCtrl.value);
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
    const { name, birth_date, gender, pet_information, image, race_id, type } = this.petForm.value; 
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
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
              this.submitting = false;
              this.unknowError = true;
              this.errorMessage = 'Ocurrió un error inesperado al subir la imagen de la mascota.';
              return throwError('');
            })
          );
        }),
        switchMap(() => {
          if (this.hasToken && this.tokenService.getCookie() !== null) {
            const token = this.tokenService.getCookie();
            const tokenForm = new FormData();
            tokenForm.append('pet_id', this.petId.toString());
            return this.qrActivationService.manageActivation(token, tokenForm).pipe(
              catchError((error: HttpErrorResponse) => {
                this.submitting = false;
                this.unknowError = true;
                this.errorMessage = 'Ocurrió un error inesperado al activar el código qr.';
                return throwError('');
              }),
            );
          } else {
            return of(null);
          }
        }),
      ).subscribe(() => {
        // Emitir el evento solo después de que la respuesta de la API se haya procesado correctamente.
        if (this.hasToken && this.tokenService.getCookie() !== null) {
          this.next.emit();
        }
      }, () => {
        // Manejar errores aquí si es necesario
      }, () => {
        // Código a ejecutar cuando la suscripción está completa, si es necesario
      });
  }
}
