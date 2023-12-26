import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle, faGears, faPaw, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { UserPetProfileSetting } from 'src/app/user/interfaces/user-pet-profile-setting.interface';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  faGears = faGears;
  faExclamationTriangle = faExclamationTriangle;
  faExclamationCircle = faExclamationCircle;
  faUser = faUser;
  faPaw = faPaw;
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;

  loader: boolean = false;
  btnValue: string = 'Guardar los cambios';
  submitting: boolean = false;
  successSubmittion: boolean = false;
  unknowError: boolean = false;
  errorMessage!: string;

  settingsForm!: FormGroup;
  profileSettings!: FormGroup;

  nameVisible!: boolean;
  locationVisible!: boolean;
  contactPhone!: boolean;
  contactMail!: boolean;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private userService: UserService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {    
    this.profileSettings = this.fb.group({
      
    });
    this.settingsForm = this.fb.group({
      user_fullname_visible: [this.nameVisible, [Validators.required]],
      user_location_visible: [this.locationVisible, [Validators.required]],
      user_phone_visible: [this.contactPhone, [Validators.required]],
      user_email_visible: [this.contactMail, [Validators.required]],
    });

    // this.loader = true;
    // this.userService.getSettings().subscribe({
    //   next: (res: UserPetProfileSetting) => {
    //     this.nameVisible = res.user_fullname_visible;
    //     this.locationVisible = res.user_location_visible;
    //     this.contactPhone = res.user_phone_visible;
    //     this.contactMail = res.user_email_visible;
    //     this.loader = false;
    //     this.settingsForm.patchValue({
    //       user_fullname_visible: this.nameVisible,
    //       user_location_visible: this.locationVisible,
    //       user_phone_visible: this.contactPhone,
    //       user_email_visible: this.contactMail,
    //     });
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.loader = false;
    //     this.unknowError = true;
    //     this.errorMessage = 'Ocurrió un error al obtener la configuración del usuario.';
    //   }
    // });
  }
  
  changeSettings() {
    this.successSubmittion = false;
    const oldBtnValue = this.btnValue;
    this.submitting = true;
    this.unknowError = false;
    const { user_fullname_visible, user_location_visible, user_phone_visible, user_email_visible } = this.settingsForm.value;
    const formData = new FormData();
    formData.append('user_fullname_visible', user_fullname_visible ? '1' : '0');
    formData.append('user_location_visible', user_location_visible ? '1' : '0');
    formData.append('user_phone_visible', user_phone_visible ? '1' : '0');
    formData.append('user_email_visible', user_email_visible ? '1' : '0');
    this.userService.changeSettings(formData).subscribe({
      next: (res: UserPetProfileSetting) => {
        this.loader = false;
        this.unknowError = false;
        this.submitting = false;
        this.successSubmittion = true;
        this.btnValue = 'Cambios guardados';
        
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        
        this.btnValue = oldBtnValue;
        this.loader = false;
        this.submitting = false;
        this.unknowError = true;
        this.errorMessage = 'Ocurrió un error al guardar los cambios.';
      }
    });
  }
}
