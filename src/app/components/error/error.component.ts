import { Component, Input } from '@angular/core';
import { errors } from 'src/app/constants/errors.constant';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() errorCode!: number;
  @Input() errorMessage!: string;
  
  constructor(){
    this.errorCode = errors.NOT_FOUND.code;
    this.errorMessage = errors.NOT_FOUND.message;
  }
}
