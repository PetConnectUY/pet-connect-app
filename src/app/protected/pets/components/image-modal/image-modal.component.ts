import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {
  constructor(
    private activeModal: NgbActiveModal,
  ){}
  @Input() imageUrl!: string;

  closeModal(){
    this.activeModal.close();
  }
}
