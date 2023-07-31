import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  showLoader = true;

  constructor() {
    window.onload = () => {
      this.showLoader = false;
    };
  }
}
