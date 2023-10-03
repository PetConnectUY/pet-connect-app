// Frontend Component
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRActivationService } from '../../services/qractivation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../interfaces/pet.interface';
import { faMars, faPaw, faUser, faVenus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { PetFoundModalComponent } from '../../components/pet-found-modal/pet-found-modal.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  faPaw = faPaw;
  faMars = faMars;
  faVenus = faVenus;
  faUser = faUser;

  unknowError: boolean = false;
  errorMessage!: string;
  tokenStatusMessage!: string;
  qrNotActived: boolean = false;
  loader: boolean = true;
  tokenExpired!: boolean;
  user: User | null;
  token!: string | null;
  loadPet: boolean = false;
  pet!: Pet;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qrActivationService: QRActivationService,
    private authService: AuthService,
    private tokenService: TokenService,
    private petService: PetService,
    private modalService: NgbModal
  ) {
    this.tokenExpired = this.authService.tokenExpired();
    this.user = this.authService.getUser();

    this.route.params.subscribe((res) => {
      this.tokenService.setToken(res['tokenId']);
      this.token = this.tokenService.getToken();

      this.qrActivationService.checkQRStatus(res['tokenId']).subscribe({
        next: (response: Message) => {
          this.tokenStatusMessage = response.message;
          switch(this.tokenStatusMessage) {
            case 'No se encontró el código qr': 
              // Retorna componente 404
              break;
            case 'Código qr no activado':
              if(this.user) {
                //Token no activado & usuario no autenticado
                if (this.tokenExpired) {
                  this.qrActivationService.setUserToToken().subscribe((res: Message) => {
                    const setUserStatus = res.message;
                    switch(setUserStatus) {
                      case 'Código QR ya existe y está activado por el usuario':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      case 'El código QR ya está en uso por otro usuario':
                        this.loadPetProfile();
                        break;
                      case 'Se asignó el código QR con éxito':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      default:
                        this.loader = false;
                        this.unknowError = true;
                        //Error component
                        this.errorMessage = 'Ocurrió un error al asignar el código qr al usuario. Por favor ponte en contacto'; 
                        break;
                    }
                  });
                } else {
                  this.qrActivationService.setUserToToken().subscribe({
                    next: (message: Message) => {
                      this.loader = false;
                      this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
                    },
                    error: (error: HttpErrorResponse) => {
                      this.unknowError = true;
                      this.errorMessage = 'Ocurrió un error al asignar el código QR a tu usuario.';
                    }
                  });
                }
              } else {
                this.router.navigate(['/users/signup/'], {queryParams: { token: this.token }});
              }
              break;
            case 'Código qr activado':
              this.loadPetProfile();
              break;
            case 'Debe asignar mascota':
              this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
              break;
            case 'Este qr no pertenece al usuario y no tiene una mascota asignada':
              this.qrNotActived = true;
              this.loader = false;
              this.loadPet = false;
              break;
            case 'Código qr en uso pero no activado':
              if(this.user) {
                if(this.tokenExpired) {
                  this.qrActivationService.setUserToToken().subscribe((res: Message) => {
                    const setUserStatus = res.message;
                    switch(setUserStatus) {
                      case 'Código QR ya existe y está activado por el usuario':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      case 'El código QR ya está en uso por otro usuario':
                        this.loadPetProfile();
                        break;
                      case 'Se asignó el código QR con éxito':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      default:
                        this.loader = false;
                        this.unknowError = true;
                        //Error component
                        this.errorMessage = 'Ocurrió un error al asignar el código qr al usuario. Por favor ponte en contacto'; 
                        break;
                    }
                  });
                } else {
                  this.qrActivationService.setUserToToken().subscribe({
                    next: (message: Message) => {
                      this.loader = false;
                      this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
                    },
                    error: (error: HttpErrorResponse) => {
                      this.unknowError = true;
                      this.errorMessage = 'Ocurrió un error al asignar el código QR a tu usuario.';
                    }
                  });
                }
              } else {
                this.router.navigate(['/users/signup/'], {queryParams: { token: this.token }});
              }
              break;
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401 && this.user) {
            this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
          } else {
            this.loader = false; // Establece el loader en false solo si no es un error 401 o no hay un usuario
            this.errorMessage = 'Ocurrió un error al validar el estado del código QR.';
          }
        }
      });
    });
  }

  ngOnInit(): void {}

  loadPetProfile() {
    this.loader = true;
    this.loadPet = false;
    this.petService.loadProfile(this.token).subscribe({
      next: (pet: Pet) => {
        this.loader = false;
        this.loadPet = true;
        this.pet = pet;
      },
      error: (error: HttpErrorResponse) => {        
        this.unknowError = true;
        this.loader = false;
        this.errorMessage = 'Ocurrió un error al obtener la mascota.';
      }
    });
  }

  petFound(token: string) {
    const modalRef = this.modalService.open(PetFoundModalComponent, {
      size: 'md',
      centered: true
    });
    modalRef.componentInstance.token = token;
    modalRef.componentInstance.pet = this.pet;
  }

  openModal(imageUrl: string) {
    const modalRef = this.modalService.open(ImageModalComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.imageUrl = imageUrl;
  }
}
