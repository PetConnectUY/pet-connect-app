import { Component } from '@angular/core';
import { faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {
  faTriangleExclamation = faTriangleExclamation;
  faQrCode = faQrcode;

  constructor(
    private activatedModal: NgbActiveModal,
  ) {}

  close(){
    this.activatedModal.close();
  }

}
