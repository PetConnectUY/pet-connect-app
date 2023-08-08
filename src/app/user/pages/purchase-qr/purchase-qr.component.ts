import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faCircleCheck, faExclamationTriangle, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/protected/interfaces/product.interface';
import { ProductService } from 'src/app/protected/shared/services/product.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-purchase-qr',
  templateUrl: './purchase-qr.component.html',
  styleUrls: ['./purchase-qr.component.scss']
})
export class PurchaseQrComponent implements OnInit {
  faCircleCheck = faCircleCheck;
  faExclamationTriangle = faExclamationTriangle;
  faQrcode = faQrcode;

  showLoader = true;
  unknowError: boolean = false;
  errorMessage!: string;

  user!: User|null;
  products!: Product[];

  btnValue:string = 'Comprar';

  constructor(
    private authService: AuthService,
    private productService: ProductService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.productService.get().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.showLoader = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showLoader = false;
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al obtener la lista de productos.';
      }
    })
  }
}
