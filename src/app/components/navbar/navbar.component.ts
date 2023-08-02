import { Component } from '@angular/core';
import { faPaw, faQrcode, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faPaw = faPaw;
  faQrcode = faQrcode;
  faRightFromBracket = faRightFromBracket;

  user: User|null;
  token: string|null;

  constructor(
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
    this.token = this.authService.getToken();
  }

  signOut() {
    this.authService.logout();
    window.location.reload();
  }
}
