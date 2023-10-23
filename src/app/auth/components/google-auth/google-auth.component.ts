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
  token!: string | null;

  constructor(
    private socialAuthService: SocialAuthService, 
    private authService: AuthService,
    private tokenService: TokenService,
    private qrActivationService: QRActivationService,
    private router: Router,
    ) {
      // this.token = this.tokenService.getToken();
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
          //
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

  startSubmittingForm() {
    this.submitting = true;
    this.btnValue = "";
  }
  
  endSubmittingForm(btnValue: string) {
    this.submitting = false;
    this.btnValue = btnValue;
  }
}
