import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faExclamationCircle, faSpinner, faEye, faEyeSlash, faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';

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
  tokenIsActivated: string | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
    this.user = this.authService.getUser();
    this.signinForm = this.fb.group({
      email: [this.user?this.user.email: ''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tokenIsActivated = params['tokenIsActivated'];
      if(this.tokenIsActivated === 'false') {
        this.modalService.open(AlertModalComponent, {
          size: 'sm',
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
      this.authService.login(email, password)
      .subscribe(
        result => {
          if(result.error) {
            this.invalidCredentials = true;
            this.endSubmittingForm(oldBtnValue);
          } else {            
            if(this.tokenIsActivated === 'false') {
              this.router.navigate(['/users/pet-profile', {tokenIsActivated: false}]);
            } else {
              this.router.navigateByUrl('/app');
            }
          }          
        }, error => {
          this.unknowError = true;
          this.endSubmittingForm(oldBtnValue);
        }
      )
    } catch(error) {
      this.unknowError = true;
      this.endSubmittingForm(oldBtnValue);
    }
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
    window.location.reload();
  } 

  toggleShow() {
    this.show = !this.show;
  }

}
