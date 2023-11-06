import { Component } from '@angular/core';
import { faGears, faHome, faPaw, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  faHome = faHome;
  faPaw = faPaw;
  faUser = faUser;
  faSignOut = faSignOut;
  faGears = faGears;

  constructor(
    private authService: AuthService,
  ) {}

  signOut() {
    this.authService.logout();
    window.location.reload();
  }
}
