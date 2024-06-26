import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { faCircleNotch, faDog, faEllipsisVertical, faGears, faHome, faPaw, faPen, faQrcode, faSignOut, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pet } from 'src/app/protected/pets/interfaces/pet.interface';
import { PetPagination } from 'src/app/protected/pets/interfaces/pet.pagination.interface';
import { PetService } from 'src/app/protected/pets/services/pet.service';
import { UserService } from 'src/app/user/services/user.service';
import { ModalFormComponent } from '../../components/modal-form/modal-form.component';
import { PetImage } from 'src/app/protected/pets/interfaces/pet.image.interface';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { finalize, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy{
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  faPaw = faPaw;
  faDog = faDog;
  faQrcode = faQrcode;
  faCircleNotch = faCircleNotch;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faHome = faHome;
  faUser = faUser;
  faSignOut = faSignOut;
  faGears = faGears;

  totalPets!: number;
  totalTokens!: number;
  counterLoader: boolean = true;
  pets!: PetPagination;
  petsLoader: boolean = true;
  unknowError: boolean = false;
  errorMessage!: string;

  constructor(
    private userService: UserService,
    private petService: PetService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.updatePets();
    this.counterLoader = true;
    this.userService.getStatistics().subscribe({
      next: (res) => {
        this.totalPets = res.total_pets;
        this.totalTokens = res.total_tokens;
        this.counterLoader = false;
      },
      error: (error: HttpErrorResponse) => {
        this.totalPets = NaN;
        this.totalTokens = NaN;
        this.counterLoader = true;
      }
    });
  }

  updatePets() {
    this.route.queryParamMap.subscribe(paramMap => {
      this.petsLoader = true;
      this.petService.getPets(paramMap).subscribe({
        next: (pets: PetPagination) => {
          this.pets = pets;
          this.petsLoader = false;
        },
        error: (error: HttpErrorResponse) => {
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al obtener las mascotas.';
          this.petsLoader = false;
        }
      });
    });
  }

  editPet(pet: Pet) {
    const modalRef = this.modalService.open(ModalFormComponent, {
      size: "md",
      centered: true,
    });
    modalRef.componentInstance.petToEdit = pet;
    modalRef.componentInstance.emitPet.subscribe((res: Pet) => {
      const updatedPetIndex = this.pets.data.findIndex(item => item.id === res.id);
      if (updatedPetIndex !== -1) {
        this.pets.data[updatedPetIndex] = res;
      }
  
      modalRef.componentInstance.emitPetImage.subscribe((image: PetImage) => {
        const updatedImageIndex = res.images.findIndex(imageIndex => imageIndex.id === image.id);
        if (updatedImageIndex !== -1) {
          this.pets.data[updatedPetIndex].images[updatedImageIndex].url = image.url;
        } else if (res.images.length <= 0) {
          this.pets.data[updatedPetIndex].images = [image];
        }
      });
    });
  }

  deletePet(pet: Pet) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      size: 'sm',
    });
    modalRef.componentInstance.title = 'Confirmar eliminación';
    modalRef.componentInstance.message = `¿Estás seguro de que deseas eliminar a ${pet.name}?`;
  
    modalRef.componentInstance.deleteEvent.subscribe((result: boolean) => {
      if(result) {
        this.performDelete(pet, modalRef);
      }
    });

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.performDelete(pet, modalRef);
        }
      })
      .catch(() => {});
  }

  performDelete(pet: Pet, modalRef: NgbModalRef) {
    modalRef.componentInstance.loading = true;
  
    const observables = [];
  
    if (pet.images.length > 0) {
      observables.push(this.petService.deletePetImage(pet.images[0].id));
    }
  
    observables.push(this.petService.deletePet(pet.id));
  
    forkJoin(observables)
      .pipe(
        finalize(() => {
          const deletedPetIndex = this.pets.data.findIndex((item) => item.id === pet.id);
          if (deletedPetIndex !== -1) {
            this.pets.data.splice(deletedPetIndex, 1);
          }
          modalRef.close();
        })
      )
      .subscribe(
        () => {
          // Éxito en la eliminación de los elementos.
        },
        (error: HttpErrorResponse) => {
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al eliminar la mascota.';
          modalRef.componentInstance.loading = false;
        }
      );
  }

  signOut() {
    this.authService.logout();
    window.location.reload();
  }
}
