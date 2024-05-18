import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionService } from 'src/app/shared/services/subscription.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  subscribeForm!: FormGroup;
  loading: boolean = false;

  faSpinner = faSpinner;
  faChevronRight = faChevronRight;

  constructor(private fb: FormBuilder, private subscriptionService: SubscriptionService, private snackBar: MatSnackBar) {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.subscribeForm.valid) {
      this.loading = true;
      this.subscriptionService.subscribe(this.subscribeForm.value.email).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Subscripción exitosa.', 'Cerrar', {
            duration: 5000,
          });
        },
        error: (error) => {
          this.loading = false;
          if(error.status === 422) {
            this.snackBar.open('Este correo ya está suscripto.', 'Cerrar', {
              duration: 0,
            });
          }
        }
      });
    }
  }

}
