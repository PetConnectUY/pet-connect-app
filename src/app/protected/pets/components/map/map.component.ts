import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;

  @Input() address!: string;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: L.Map;
  unknowError: boolean = false;
  errorMessage!: string;

  ngOnInit(): void {
    const mapElement = this.mapContainer.nativeElement;

    // Inicializa el mapa en el contenedor especificado
    this.map = L.map(mapElement, {zoomControl: false}).setView([51.505, -0.09], 50);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Utiliza el servicio de geocodificación para obtener las coordenadas y agregar un marcador
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.address)}`)
      .then(response => response.json())
      .then(data => {
        this.unknowError = false;
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const location = L.latLng(lat, lon);

          L.circle(location, {
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.3,
            radius: 2000
          }).addTo(this.map);

          this.map.setView(location, 12);
        }
      })
      .catch(error => {
        this.unknowError = true;
        this.errorMessage = 'Ocurró un error al obtener el mapa.';
      });
  }
}
``
