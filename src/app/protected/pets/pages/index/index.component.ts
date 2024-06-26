import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRActivationService } from '../../services/qractivation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { Pet } from '../../interfaces/pet.interface';
import { faMars, faPaw, faUser, faVenus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { PetFoundModalComponent } from '../../components/pet-found-modal/pet-found-modal.component';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
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
  showImageModal: boolean = false;
  modalImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qrActivationService: QRActivationService,
    private authService: AuthService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.tokenExpired = this.authService.tokenExpired();
    this.user = this.authService.getUser();

    this.route.params.subscribe((res) => {
      
      this.tokenService.deleteCookie();
      this.tokenService.setCookie(res['tokenId']);
      this.qrActivationService.manageActivation(this.tokenService.getCookie()).subscribe({
        next: (res: Pet | Message) => {
          if('pet' in res) {
            this.tokenService.deleteCookie();
            this.loadPet = true;            
            this.loader = false;
            this.pet = res.pet as Pet;
          } else if ('message' in res) {
            switch(res.message) {
              case 'Se asignó el código QR con éxito':
                this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { hasToken: true } });
                break;
              default:
                this.tokenService.deleteCookie();
                this.unknowError = true;
                this.errorMessage = 'Ocurrió un error inesperado.';
                break;
            }
          }
        },
        error: (error: HttpErrorResponse) => {              
          switch(error.status) {
            case 404: 
              throw new Error('404');
              break;
            case 400:
              switch(error.error.error) {
                case 'Debe asignar la mascota al código QR.':
                  this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { hasToken: true } });
                  break;
                case 'Intente nuevamente.':
                  this.tokenService.deleteCookie();
                  window.location.reload();
                  break;
                case 'Este código QR no te pertenece.':
                  this.tokenService.deleteCookie();
                  let toast = this.toastr.error('El código ya pertenece a otro usuario.', 'Error', {
                    timeOut: 15000,
                    progressBar: true,
                  });

                  toast.onHidden.subscribe(() => {
                    this.router.navigate(['/app']);
                  });
                  
                  break;
                case 'Hay un caso no cubierto.':
                  this.tokenService.deleteCookie();
                  toast = this.toastr.error('Error desconocido. Por favor ponte en contacto con nosotros para resolverlo.', 'Error', {
                    timeOut: 15000,
                    progressBar: true,
                  });

                  toast.onHidden.subscribe(() => {
                    this.router.navigate(['/app']);
                  });
                  break;
              }
              break;
            case 500:
              this.tokenService.deleteCookie();
              const toast = this.toastr.error('Error desconocido. Por favor ponte en contacto con nosotros para resolverlo.', 'Error', {
                timeOut: 15000,
                progressBar: true,
              });

              toast.onHidden.subscribe(() => {
                this.router.navigate(['/app']);
              });
              break;
          }
        }
      });
    });
  }

  ngOnInit(): void {}

  petFound(token: string) {
    const modalRef = this.modalService.open(PetFoundModalComponent, {
      size: 'md',
      centered: true
    });
    modalRef.componentInstance.token = token;
    modalRef.componentInstance.pet = this.pet;
  }

  closeModal() {
    this.showImageModal = false;
  }

  openImage(url: string) {
    this.modalImageUrl = url;
    this.showImageModal = true;
  }
}
