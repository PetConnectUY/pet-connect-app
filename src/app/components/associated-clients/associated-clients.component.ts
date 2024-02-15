import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { faCheckCircle, faExclamationCircle, faLocationCrosshairs, faLocationDot, faLocationPin, faMagnifyingGlassLocation, faMobileScreen, faPersonCircleCheck, faShieldCat, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { Client } from 'src/app/protected/clients/interfaces/client.interface';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ScrollService } from 'src/app/shared/services/scroll.service';

@Component({
  selector: 'app-associated-clients',
  templateUrl: './associated-clients.component.html',
  styleUrls: ['./associated-clients.component.scss']
})
export class AssociatedClientsComponent implements AfterViewInit, OnInit {
  faExclamationCircle = faExclamationCircle;
  faLocationPin = faLocationPin;
  faLocationDot = faLocationDot;
  faLocationCrosshairs = faLocationCrosshairs;
  faMobileScreen = faMobileScreen;
  faPersonCircleCheck = faPersonCircleCheck;
  faShieldCat = faShieldCat;
  faCheckCircle = faCheckCircle;
  faMagnifyingGlassLocation = faMagnifyingGlassLocation;
  faTimes = faTimes;
  unknowError: boolean = false;
  errorMessage!: string;
  @Input() clients!: Client[];
  images: any[] = [];

  isDesktop: boolean = true;

  @ViewChild('clientMapContainer', { static: true, }) clientMapContainer!: ElementRef;
  @ViewChild('sellPointsElement', { static: true }) sellPointsElement!: ElementRef;
  @ViewChild('howToGet', { static: true }) howToGet!: ElementRef;
  
  map!: L.Map;
  mapActivated: boolean = false;
  initialClick: boolean = false;
  showCloseButton: boolean = false;
  
  constructor(
    config: NgbCarouselConfig, 
    private scrollService: ScrollService
  ) 
  {
    config.animation = true;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.interval = 0;
  }

  ngOnInit(): void {
    this.clients.forEach(element => {
      this.images.push({
        image: element.url,
        thumbImage: element.url,
        name: element.name,
        title: element.name,
       }); 
    });
    const mediaQueryList = window.matchMedia('(max-width: 768px)');
    this.handleScreenSizeChange(mediaQueryList);
    mediaQueryList.addListener(() => {
      this.handleScreenSizeChange(mediaQueryList);
    });
  }

  ngAfterViewInit(): void {
    this.scrollService.scroll$.subscribe((sectionId: string) => {
      if (sectionId === 'howToGet') {
        const howToGetPosition = this.howToGet.nativeElement.offsetTop;
        window.scrollTo({
          top: howToGetPosition,
          behavior: 'smooth'
        });
      }
    });
    const mapElement = this.clientMapContainer.nativeElement;
    this.map = L.map(mapElement, { dragging: false, zoomControl: true, scrollWheelZoom: false }).setView([-34.7011, -56.1915], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Itera sobre todas las centrales y sucursales y agrega marcadores para cada una
    if(this.clients) {
      this.clients.forEach(client => {
        // Marcador para la central
        this.addMarker(client.central_address, client.name, '');
  
        // Marcadores para las sucursales
        if(client.branches.length > 0) {
          client.branches.forEach(branch => {
            this.addMarker(branch.address, branch.contact_firstname, 'Sucursal');
          });
        }
      });
    }
  }
  

  handleScreenSizeChange(mediaQueryList: MediaQueryList) {
    this.isDesktop = !mediaQueryList.matches;
  }

  private addMarker(address: string, title: string, type: string): void {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const location = L.latLng(lat, lon);

          const size = L.divIcon({
            className: 'custom-icon',
            html: `
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.06298 10.063 6.27212 12.2721 6.27212C14.4813 6.27212 16.2721 8.06298 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16755 11.1676 8.27212 12.2721 8.27212C13.3767 8.27212 14.2721 9.16755 14.2721 10.2721Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.39409 5.48178 3.79417C8.90918 0.194243 14.6059 0.054383 18.2059 3.48178C21.8058 6.90918 21.9457 12.6059 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.97318 6.93028 5.17324C9.59603 2.3733 14.0268 2.26452 16.8268 4.93028C19.6267 7.59603 19.7355 12.0268 17.0698 14.8268Z"
                fill="black"
              />
            </svg>`
          });

          const marker = L.marker(location, {
            draggable: false,
            keyboard: true,
            icon: size
          }).addTo(this.map);

          const popupContent = `<p>${title}</p><p>${address}</p>`;

          marker.bindPopup(popupContent);

          marker.on('click', function () {
            marker.openPopup();
          });

          marker.bindTooltip(`${title}`, {
            direction: 'top',
            permanent: false,
            className: 'custom-tooltip',
          });

          marker.on('mouseover', function () {
            marker.openTooltip();
          });

          marker.on('mouseout', function () {
            marker.closeTooltip();
          });

        }
      })
      .catch(error => {
        console.error('Ocurrió un error al obtener el mapa.', error);
      });
  }

  toSection(e: MouseEvent): void {
    e.preventDefault();
    const sellPointsPosition = this.sellPointsElement.nativeElement.offsetTop;
    // Desplazamiento suave
    window.scrollTo({
      top: sellPointsPosition,
      behavior: 'smooth'
    });
  }

  toggleMapActivation(event: MouseEvent) {
    if (this.initialClick) {
        // Primer clic, no desactivar el mapa pero establecer que no es el primer clic
        this.initialClick = false;
    } else {
        // Segundo clic en adelante, activar/desactivar el mapa normalmente
        this.mapActivated = true;
        this.showCloseButton = this.mapActivated;

        if (this.mapActivated) {
            // Aquí puedes realizar acciones adicionales cuando el mapa se activa
            this.map.dragging.enable(); // Habilitar el deslizamiento del mapa
        } else {
            // Aquí puedes realizar acciones adicionales cuando el mapa se desactiva
            this.map.dragging.disable(); // Deshabilitar el deslizamiento del mapa
        }
    }

    // Verificar si el clic ocurrió dentro del mapa
    const mapRect = this.clientMapContainer.nativeElement.getBoundingClientRect();
    const clickInsideMap = event.clientX >= mapRect.left &&
                           event.clientX <= mapRect.right &&
                           event.clientY >= mapRect.top &&
                           event.clientY <= mapRect.bottom;

    // Si el clic ocurrió dentro del mapa, evita que se propague al manejador de clics del documento
    if (clickInsideMap) {
        event.stopPropagation();
    }
}

@HostListener('document:click', ['$event'])
handleDocumentClick(event: MouseEvent) {
    if (!this.clientMapContainer.nativeElement.contains(event.target)) {
        // El clic fue fuera del contenedor del mapa, desactivar el mapa y permitir el primer clic nuevamente
        this.mapActivated = false;
        // También deshabilitar el deslizamiento del mapa al ocultar el fondo
        this.map.dragging.disable();
        this.showCloseButton = this.mapActivated;
    }
}

closeMap(event: MouseEvent) {
  event.stopPropagation(); // Evitar que el clic se propague al contenedor del mapa
  this.mapActivated = false;
  this.showCloseButton = false;
  this.map.dragging.disable();
}
}
