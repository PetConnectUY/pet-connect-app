import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  user: User|null;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }
}
