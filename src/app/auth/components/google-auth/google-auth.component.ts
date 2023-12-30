import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthResponse } from 'src/app/shared/interfaces/auth-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  @Output() googleLogin = new EventEmitter<SocialUser>();

  constructor(
    private socialAuthService: SocialAuthService, 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    ) {}

  ngOnInit() {
    this.submitting = false;
    this.socialAuthService.authState.subscribe((user) => {
      this.googleLogin.emit(this.user);
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
        if(res.user.birth_date === null || res.user.phone === null || res.user.address === null) {
          this.router.navigateByUrl('/users/signup/google');
        } else {
          const redirectUrl = this.route.snapshot.queryParams['redirect_url'] || '/dashboard';
          this.router.navigateByUrl(redirectUrl);
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
