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
export class IndexComponent implements OnInit{

  unknowError: boolean = false;
  errorMessage!: string;
  tokenIsActived!:boolean;
  loader: boolean = true;
  isAuthenticated!: boolean;
  user: User | null;
  token!: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qrActivationService: QRActivationService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.user = this.authService.getUser();
    this.route.params.subscribe((res) => {
      this.tokenService.setToken(res['tokenId']);
      this.token = this.tokenService.getToken();
      this.qrActivationService.checkIfIsActived(res['tokenId']).subscribe({
        next: (res: boolean) => {
          this.tokenIsActived = res;
          if (!this.tokenIsActived) {
            if (!this.isAuthenticated) {
              // El token no está activado y el usuario no está autenticado
              this.router.navigate(['/users/signup'], { queryParams: { token: this.token } });
            } else if (!this.user) {
              // El token no está activado y el usuario está autenticado pero no registrado
              this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
            } else {
              // El token no está activado y el usuario está autenticado y registrado
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
            // El token ya está activado, obtén la información de la mascota
            this.loader = false;
            this.loadPetProfile(); // Esta función debería obtener la información de la mascota y mostrarla en la vista.
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loader = false;
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al chequear si el QR está activado.';
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
