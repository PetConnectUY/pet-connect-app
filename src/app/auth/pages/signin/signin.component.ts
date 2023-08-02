import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faExclamationCircle, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

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

  showLoader = true;
  user: User|null;

  signinForm!: FormGroup;
  show: boolean = false;
  submitting: boolean = false;
  btnValue: string = 'Ingresar';
  unknowError: boolean = false;
  invalidCredentials: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    this.signinForm = this.fb.group({
      username: [this.user?this.user.username: ''],
      password: [''],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  login() {
    this.invalidCredentials = false;
    this.unknowError = false;
    const oldBtnValue = this.btnValue;
    this.startSubmittingForm();
    const { username, password } = this.signinForm.value;
    try {
      this.authService.login(username, password)
      .subscribe(
        result => {
          if(result.error) {
            this.invalidCredentials = true;
            this.endSubmittingForm(oldBtnValue);
          } else {
            this.router.navigateByUrl('/app');
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
