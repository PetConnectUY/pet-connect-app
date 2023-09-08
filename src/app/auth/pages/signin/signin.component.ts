import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faExclamationCircle, faSpinner, faEye, faEyeSlash, faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { TokenService } from 'src/app/shared/services/token.service';
import { QRActivationService } from 'src/app/protected/pets/services/qractivation.service';
import { Message } from 'src/app/user/interfaces/message.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faQrCode = faQrcode;
  faTriangleExclamation = faTriangleExclamation;

  showLoader = true;
  user: User|null;

  signinForm!: FormGroup;
  show: boolean = false;
  submitting: boolean = false;
  btnValue: string = 'Ingresar';
  unknowError: boolean = false;
  invalidCredentials: boolean = false;
  token: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private qrActivationService: QRActivationService,
  ) {
    this.user = this.authService.getUser();
    this.token = this.tokenService.getToken();
    this.signinForm = this.fb.group({
      email: [this.user?this.user.email: ''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tokenParam = params['token'];
      if(tokenParam) {
        this.modalService.open(AlertModalComponent, {
          size: 'md',
          centered: true,
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  login() {
    this.invalidCredentials = false;
    this.unknowError = false;
    const oldBtnValue = this.btnValue;
    this.startSubmittingForm();
    const { email, password } = this.signinForm.value;
  
    try {
      this.authService.login(email, password).subscribe(
        result => {
          if (result.error) {
            this.invalidCredentials = true;
            this.endSubmittingForm(oldBtnValue);
          } else {
            if (this.token) {
              this.assignQR();
            } else {
              this.router.navigateByUrl('/app');
            }
          }
        },
        error => {
          this.unknowError = true;
          this.endSubmittingForm(oldBtnValue);
        }
      );
    } catch (error) {
      this.unknowError = true;
      this.endSubmittingForm(oldBtnValue);
    }
  }

  assignQR() {
    const oldBtnValue = this.btnValue;
    this.qrActivationService.setUserToToken().subscribe({
      next: (message: Message) => {
        if (message.message === 'Código QR ya existe y está activado por el usuario') {
          this.router.navigate(['/auth/signin/pet-profile/', this.token]);
        } else if (message.message === 'El código QR ya está en uso por otro usuario.') {
          this.tokenService.clearToken();
          this.token = null;
          this.router.navigate(['/auth/signin/pet-profile']);
        } else if (message.message === 'Se asignó el código QR con éxito') {
          this.router.navigate(['/auth/signin/pet-profile'], { queryParams: { token: this.token } });
        }
      },
      error: (res: HttpErrorResponse) => {
        this.unknowError = true;
        this.endSubmittingForm(oldBtnValue);
      }
    });
  }

  startSubmittingForm() {
    this.submitting = true;
    this.btnValue = "";
  }
  
  endSubmittingForm(btnValue: string) {
    this.submitting = false;
    this.btnValue = btnValue;
  }

  removeAccount() {
    this.authService.clearStorage();
    this.user = null;
  } 

  toggleShow() {
    this.show = !this.show;
  }

}
