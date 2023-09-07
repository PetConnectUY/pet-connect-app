import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-template',
  templateUrl: './progress-template.component.html',
  styleUrls: ['./progress-template.component.scss']
})
export class ProgressTemplateComponent {
  currentStep: number = 0;
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
}
