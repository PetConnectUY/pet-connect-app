import { Component } from '@angular/core';
import { faHome, faPaw, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';

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
}
