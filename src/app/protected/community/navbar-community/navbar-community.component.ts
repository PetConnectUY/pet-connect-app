import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-navbar-community',
  templateUrl: './navbar-community.component.html',
  styleUrls: ['./navbar-community.component.scss']
})
export class NavbarCommunityComponent implements OnInit {
  notifications: number = 2;
  userMenuOpen = false;
  notificationsOpen = false;

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.notificationsOpen = false;
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('button')) {
      this.userMenuOpen = false;
      this.notificationsOpen = false;
    }
  }

  openSettings() {
    // Implementar lógica para abrir configuración
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
