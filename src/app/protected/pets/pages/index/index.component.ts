import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRActivationService } from '../../services/qractivation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';

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
          this.loader = false;
          this.tokenIsActived = res;

          if(!this.tokenIsActived && !this.isAuthenticated && !this.user) {
            this.router.navigate(['/users/signup'], {queryParams: {token: this.token}});
          } else if(!this.tokenIsActived && !this.isAuthenticated && this.user) {
            this.router.navigate(['/auth/signin'], {queryParams: {token: this.token}});
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loader = false;
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al chequear si el qr está activado.';
        }
      });
    });
  }

  ngOnInit(): void {}
}
