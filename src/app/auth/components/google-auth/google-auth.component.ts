import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment.development';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {
  user!: SocialUser;
  loggedIn!: boolean;
  submitting: boolean = false;

  constructor(
    private socialAuthService: SocialAuthService, 
    private authService: AuthService,
    private router: Router,
    ) { }

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
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: HttpErrorResponse) => {

      }
    });
  }
}
