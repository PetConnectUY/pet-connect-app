import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()" [disabled]="loading"></button>
    </div>
    <div class="modal-body">
      {{ message }}
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="cancel()"
        [disabled]="loading"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="btn btn-danger"
        (click)="confirm()"
        [ngClass]="{ 'disabled': loading }"
        [disabled]="loading"
      >
        <ng-container *ngIf="!loading; else loadingButtonTemplate">Confirmar</ng-container>
        <ng-template #loadingButtonTemplate>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Cargando...
        </ng-template>
      </button>
    </div>
  `,
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmar';
  @Input() message = '¿Estás seguro?';
  @Input() loading = false;
  @Output() deleteEvent: EventEmitter<boolean> = new EventEmitter()

  constructor(public activeModal: NgbActiveModal) {}

  cancel() {
    if (!this.loading) {
      this.activeModal.dismiss('cancel');
    }
  }

  confirm() {
    if (!this.loading) {
      this.loading = true;
      this.deleteEvent.emit(true);
    }
  }
}
