import { Component } from '@angular/core';
import { faExclamationCircle, faPaw, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  faExclamationCircle = faExclamationCircle;
  faUser = faUser;
  faPaw = faPaw;

  nameVisible: boolean = true;
  locationVisible: boolean = true;
  contactPhone: boolean = true;
  contactMail: boolean = true;
}
