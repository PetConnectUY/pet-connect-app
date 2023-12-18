import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  clients!: Client[];
  loader: boolean = true;
  unknowError: boolean = false;
  errorMessage!: string;
  constructor(
    private clientsService: ClientService,
  ) {
    this.clientsService.getClients().subscribe({
      next: (res: Client[]) => {        
        this.clients = res;
        this.loader = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loader = false;
        this.unknowError = true;
        this.errorMessage = "Ocurrió un error al obtener los clientes.";
      }
    });
  }
}
