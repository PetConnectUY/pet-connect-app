import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faCircleCheck, faExclamationTriangle, faQrcode, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
  faSpinner = faSpinner;

  showLoader = true;
  unknowError: boolean = false;
  errorMessage!: string;
  loading: boolean = false;

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
    });
  }

  purchaseProduct(product: Product): void {
    this.loading = true;
    this.productService.createPaymentPreference(product).subscribe({
      next: (res: any) => {
        this.loading = false;
        window.location.href = res.init_point;
      },
      error: (error: HttpErrorResponse) => {
        this.unknowError = true;
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al obtener el enlace de pago.';
        this.loading = false;
        
      }
    })
  }
}
