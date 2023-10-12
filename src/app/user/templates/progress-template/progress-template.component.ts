import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-progress-template',
  templateUrl: './progress-template.component.html',
  styleUrls: ['./progress-template.component.scss']
})
export class ProgressTemplateComponent {
  
  user: User | null;
  isAuthenticated: boolean = false;
  petId: number | undefined;
  
  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    this.isAuthenticated = this.authService.isAuthenticated();    
  }
  
  currentStep: number = 0;
  eventPetId($event: number | undefined) {    
    this.petId = $event;
  }
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }
}
