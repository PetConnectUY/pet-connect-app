import { Component, OnInit } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../interfaces/pet.interface';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-get-token',
  templateUrl: './get-token.component.html',
  styleUrls: ['./get-token.component.scss']
})
export class GetTokenComponent implements OnInit {

  pet!: Pet;

  unknowError: boolean = false;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const petId = +params['petid'];
      this.petService.getPet(petId).subscribe({
        next: (res: Pet) => {
          this.pet = res;
          this.unknowError = false;
        },
        error: (error: HttpErrorResponse) => {
          this.unknowError = true;
          this.errorMessage = 'Ocurrió un error al obtener la mascota.';
        }
      });
    })
  }
}
