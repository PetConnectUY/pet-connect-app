import { Component, OnInit, HostBinding } from '@angular/core';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dark-mode-toggler',
  templateUrl: './dark-mode-toggler.component.html',
  styleUrls: ['./dark-mode-toggler.component.scss']
})
export class DarkModeTogglerComponent implements OnInit {
  @HostBinding('class.dark-mode') darkMode = false;

  faCircleHalfStroke = faCircleHalfStroke;

  constructor() { }

  ngOnInit(): void {
    const darkModePreference = localStorage.getItem('darkMode');
    this.darkMode = darkModePreference === 'true';
    this.applyDarkMode();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.applyDarkMode();
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  private applyDarkMode(): void {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
