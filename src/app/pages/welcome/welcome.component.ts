import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Client } from 'src/app/protected/clients/interfaces/client.interface';
import { ClientService } from 'src/app/protected/clients/services/client.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  showLoader = true;
  clients!: Client[];
  loader: boolean = true;
  unknowError: boolean = false;
  errorMessage!: string;
  constructor(
    private cdr: ChangeDetectorRef,
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

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.showLoader = false;
    this.cdr.detectChanges();
  }
}
