import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUser, faPaw, faStore, faQrcode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() currentStep!: number;

  steps: { icon: IconProp }[] = [
    { icon: faUser },
    { icon: faPaw },
    { icon: faStore },
    { icon: faQrcode }
  ];

  getStepClasses(index: number): string {
    if (index < this.currentStep) {
      return 'bar__container__item--completed';
    } else if (index === this.currentStep) {
      return 'bar__container__item--current';
    } else {
      return 'bar__container__item';
    }
  }
}
