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
    this.map = L.map(mapElement, { zoomControl: false }).setView([-34.9011, -56.1645], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.geocodeAddress(this.address).then(result => {
      if (!result) {
        const addressParts = this.extractKeyComponents(this.address);
        const keyAddress = addressParts.join(', ');
        this.geocodeAddress(keyAddress).then(result => {
          if (!result) {
            this.showDefaultLocation();
          }
        });
      }
    }).catch(() => {
      this.unknowError = true;
      this.errorMessage = 'Ocurrió un error al obtener el mapa.';
    });
  }

  geocodeAddress(address: string): Promise<boolean> {
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(response => response.json())
      .then(data => {
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
          return true;
        } else {
          return false;
        }
      })
      .catch(() => {
        return false;
      });
  }

  extractKeyComponents(address: string): string[] {
    const addressParts = address.split(',');
    const keyComponents = addressParts.filter(part => {
      return part.trim().match(/^\d+/) === null;
    });
    return keyComponents;
  }

  showDefaultLocation(): void {
    const defaultLocation = L.latLng(-34.9011, -56.1645);
    L.circle(defaultLocation, {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3,
      radius: 2000
    }).addTo(this.map);
    this.map.setView(defaultLocation, 12);
  }
}