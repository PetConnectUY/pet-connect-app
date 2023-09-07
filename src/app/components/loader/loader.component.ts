import { Component } from '@angular/core';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  faPaw = faPaw;
}
