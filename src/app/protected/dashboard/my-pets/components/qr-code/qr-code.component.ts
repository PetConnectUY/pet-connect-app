import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  template: `
    <svg></svg>
  `,
})
export class QrCodeComponent {
  @Input() qrCodeSvg: string = '';
}
