import { Component } from '@angular/core';
import { faCircleCheck, faExclamationTriangle, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-purchase-qr',
  templateUrl: './purchase-qr.component.html',
  styleUrls: ['./purchase-qr.component.scss']
})
export class PurchaseQrComponent {
  faCircleCheck = faCircleCheck;
  faExclamationTriangle = faExclamationTriangle;
  faQrcode = faQrcode;

  user!: User|null;

  btnValue:string = 'Comprar';

  constructor(
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }
}
