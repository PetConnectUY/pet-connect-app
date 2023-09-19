import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() address!: string;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: L.Map;

  ngOnInit(): void {
    const mapElement = this.mapContainer.nativeElement;

    // Inicializa el mapa en el contenedor especificado
    this.map = L.map(mapElement).setView([51.505, -0.09], 50);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Utiliza el servicio de geocodificación para obtener las coordenadas y agregar un marcador
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.address)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const location = L.latLng(lat, lon);

          L.circle(location, {
            color: 'blue', // Color del círculo
            fillColor: 'blue', // Color de relleno del círculo
            fillOpacity: 0.3, // Opacidad del relleno
            radius: 2000 // Radio del círculo en metros (ajusta según tus necesidades)
          }).addTo(this.map);

          this.map.setView(location, 13);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
``
