import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { errors } from 'src/app/errors/constants/errors.constant';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() errorCode!: number;
  @Input() errorMessage!: string;
  
  constructor(
    private route: ActivatedRoute,
  ){
    this.route.params.subscribe(res => {
      switch(res['code']) {
        case '404':
          this.errorCode = errors.NOT_FOUND.code,
          this.errorMessage = errors.NOT_FOUND.message;
          break;
        case '502': 
          this.errorCode = errors.TIME_OUT.code;
          this.errorMessage = errors.TIME_OUT.message;
          break;
        case '500':
          this.errorCode = errors.INTERNAL_SERVER_ERROR.code;
          this.errorMessage = errors.INTERNAL_SERVER_ERROR.message;
          break;
      }
    });
  }
}
