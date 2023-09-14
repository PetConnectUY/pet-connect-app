import { Component, OnInit } from '@angular/core';
import { faCirclePlus, faEllipsisVertical, faEyeSlash, faGears, faPen, faQrcode, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PetService } from '../../../../pets/services/pet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PetPagination } from '../../interfaces/pet.pagination.interface';
import { ModalFormComponent } from '../../components/modal-form/modal-form.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pet } from '../../interfaces/pet.interface';
import { PetImage } from '../../interfaces/pet.image.interface';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { concatMap, finalize } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  faQrcode = faQrcode;
  faGears = faGears;
  faPen = faPen;
  faEyeSlash = faEyeSlash;
  faTrash = faTrash;
  faEllipsisVertical = faEllipsisVertical;
  faTriangleExclamation = faTriangleExclamation;
  faCirclePlus = faCirclePlus;

  user: User|null;
  pets!: PetPagination;
  unknowError: boolean = false;
  errorMessage!: string;

  constructor(
    private authService: AuthService,
    private petService: PetService,
    private modalService: NgbModal,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.petService.getPets().subscribe({
      next: (res: PetPagination) => {
        this.pets = res;
      },
      error: (error: HttpErrorResponse) => {
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al obtener tus mascotas.'
      }
    })
  }

  createPet() {
    const modalRef = this.modalService.open(ModalFormComponent, {
      size: 'lg',
      centered: true,
    });
  
    modalRef.componentInstance.emitAtCreate.subscribe(({ pet, image }: { pet: Pet, image: PetImage }) => {
      if (!this.pets.data) {
        this.pets.data = [];
      }
  
      if (image) {
        pet.images = [image];
      }
  
      this.pets.data.push(pet);
    });
  }

  editPet(pet: Pet) {
    const modalRef = this.modalService.open(ModalFormComponent, {
      size: "lg",
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
  
    if (pet.pet_token) {
      observables.push(this.petService.deleteQrToken(pet.pet_token.id));
    }
  
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
  
}
