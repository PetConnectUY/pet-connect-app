import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPaw, faQrcode, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  faPaw = faPaw;
  faUser = faUser;
  faQrcode = faQrcode;
  faRightFromBracket = faRightFromBracket;

  user: User|null;
  token: string|null;

  constructor(
    private authService: AuthService,
    private router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    this.token = this.authService.getToken();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  signOut() {
    this.authService.logout();
    window.location.reload();
  }

  isSignupRoute(): boolean {    
    return this.router.url === '/users/signup';
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
