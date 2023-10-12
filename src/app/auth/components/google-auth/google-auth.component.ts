import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment.development';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {
  user!: SocialUser;
  loggedIn!: boolean;
  submitting: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;
  btnValue: string = '';
  token: string | null;

  constructor(
    private socialAuthService: SocialAuthService, 
    private authService: AuthService,
    private tokenService: TokenService,
    private qrActivationService: QRActivationService,
    private router: Router,
    ) {
      this.token = this.tokenService.getToken();
    }

  ngOnInit() {
    this.submitting = false;
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.sendUserInfoToBackend(this.user);
      }
    });
  }

  sendUserInfoToBackend(user: SocialUser) {
    this.submitting = true;
    this.authService.authWithGoogle(user).subscribe({
      next: (res: AuthResponse) => {
        if(this.token) {
          this.manageActivation();
        } else {
          if(res.user.birth_date === null || res.user.phone === null || res.user.address === null) {
            this.router.navigateByUrl('/users/signup/google');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        }
      },
      error: (error: HttpErrorResponse) => {

      }
    });
  }

  manageActivation() {
    const oldBtnValue = this.btnValue;
    this.qrActivationService.checkQRStatus(this.token).subscribe({
      next: (res: Message) => {
        const tokenStatus = res.message;

        switch(tokenStatus) {
          case 'No se encontró el código qr':
            // Componente 404
            break;
          case 'Código qr no activado':
            this.qrActivationService.setUserToToken().subscribe((res: Message) => {
              const setUserStatus = res.message;
              switch(setUserStatus) {
                case 'Código QR ya existe y está activado por el usuario':
                  this.router.navigate(['/users/pet-profile'], { queryParams: { token: this.token } });
                  break;
                case 'El código QR ya está en uso por otro usuario':
                  this.router.navigate([`/pets/${this.token}`]);
                  break;
                case 'Se asignó el código QR con éxito':
                  this.router.navigate(['/users/pet-profile'], { queryParams: { token: this.token } });
                  break;
                default:
                  this.unknowError = true;
                  this.endSubmittingForm(oldBtnValue);
                  break;
              }
            });
            break;
            case 'Código qr activado':
              this.router.navigate([`/pets/${this.token}`]);
              break;
            case 'Debe asignar mascota':
              this.router.navigate(['/auth/signin/pet-profile'], {queryParams: {token: this.token}});
              break;
            case 'Este qr no pertenece al usuario y no tiene una mascota asignada':
              this.router.navigate(['/users/pet-profile']);
              break;
            case 'Código qr en uso pero no activado':
              this.qrActivationService.setUserToToken().subscribe((res: Message) => {
                const setUserStatus = res.message;
                switch(setUserStatus) {
                  case 'Código QR ya existe y está activado por el usuario':
                    this.router.navigate(['/auth/signin'], { queryParams: { token: this.token } });
                    break;
                  case 'El código QR ya está en uso por otro usuario':
                    this.router.navigate([`/pets/${this.token}`]);
                    break;
                  case 'Se asignó el código QR con éxito':
                    this.router.navigate(['/users/pet-profile'], { queryParams: { token: this.token } });
                    break;
                  default:
                    this.unknowError = true;
                    this.endSubmittingForm(oldBtnValue);
                    break;
                }
              });
              break;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.unknowError = true;
        this.endSubmittingForm(oldBtnValue);
      }
    });
  }

  startSubmittingForm() {
    this.submitting = true;
    this.btnValue = "";
  }
  
  endSubmittingForm(btnValue: string) {
    this.submitting = false;
    this.btnValue = btnValue;
  }
}
