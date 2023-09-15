// Frontend Component
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRActivationService } from '../../services/qractivation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Message } from 'src/app/user/interfaces/message.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  unknowError: boolean = false;
  errorMessage!: string;
  tokenStatusMessage!: string; // Nuevo atributo para el mensaje del backend
  loader: boolean = true;
  tokenExpired!: boolean;
  user: User | null;
  token!: string | null;
  loadPet: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qrActivationService: QRActivationService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    this.tokenExpired = this.authService.tokenExpired();
    this.user = this.authService.getUser();

    this.route.params.subscribe((res) => {
      this.tokenService.setToken(res['tokenId']);
      this.token = this.tokenService.getToken();

      this.qrActivationService.checkQRStatus(res['tokenId']).subscribe({
        next: (response: Message) => {
          console.log(response);
          
          this.tokenStatusMessage = response.message;
          
          if (this.user) {
            // Si hay un usuario en localStorage
            switch (this.tokenStatusMessage) {
              case 'Código qr no activado':
                if (this.tokenExpired) {
                  // El token no está activado y el usuario no está autenticado
                  this.qrActivationService.setUserToToken().subscribe((res: Message) => {
                    const setUserStatus = res.message;
                    switch(setUserStatus) {
                      case 'Código QR ya existe y está activado por el usuario':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      case 'El código QR ya está en uso por otro usuario':
                        this.loader = false;
                        this.loadPet = false;
                        this.loadPetProfile();
                        break;
                      case 'Se asignó el código QR con éxito':
                        this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                        break;
                      default:
                        break;
                    }
                  });
                } else {
                  // El token no está activado y el usuario está autenticado
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
                break;

              case 'Código qr activado pero mascota no asignada':
                if (this.tokenExpired) {
                  // Refresca el token JWT si el usuario está autenticado
                  this.authService.refreshToken().subscribe((response: boolean) => {                    
                    this.loader = false;
                    this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
                  });
                } else {
                  this.loader = false;
                  this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
                }
                break;

              case 'Este código qr no pertenece a este usuario':
                  // El token no pertenece al usuario, simplemente redirige al /app
                  this.loader = false;
                  this.router.navigate(['/app']);
                  break;
              case 'El código QR ha sido activado y asignado a una mascota':
                  this.loader = false;
                  this.loadPet = true;
                  this.loadPetProfile();
                  break;
              case 'El código QR ha sido activado y asignado a este usuario':
                this.loader = false;
                this.loadPet = true;
                this.loadPetProfile();
                break;

              default:
                // Maneja otros casos si es necesario
                break;
            }
          } else {
            // Si no hay usuario en localStorage
            switch (this.tokenStatusMessage) {
              case 'Código qr no activado':
                this.router.navigate(['/auth/signup'], { queryParams: { token: this.token } });
                break;

              case 'Este código qr no pertenece a este usuario':
                // El token no pertenece al usuario, simplemente redirige al /app
                this.loader = false;
                this.router.navigate(['/app']);
                break;

              case 'El código QR ha sido activado y asignado a una mascota':
                this.loader = false;
                this.loadPet = true;
                this.loadPetProfile();
                break;

              case 'El código QR ha sido activado y asignado a este usuario':
                this.loader = false;
                this.loadPet = true;
                this.loadPetProfile();
                break;
              default:
                // Maneja otros casos si es necesario
                break;
            }
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
    // Realiza la solicitud al backend para obtener la información de la mascota
    // y muestra la vista del perfil de la mascota con la información recibida.
    // Puedes implementar esta lógica aquí mismo o en una función separada según tu estructura de componentes.
  }
}
