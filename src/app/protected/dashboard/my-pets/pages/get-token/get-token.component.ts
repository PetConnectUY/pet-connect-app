import { Component, OnInit } from '@angular/core';
import { PetService } from '../../../../pets/services/pet.service';
import { Pet } from '../../../../pets/interfaces/pet.interface';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { faBell, faCircleArrowLeft, faCircleCheck, faCircleDollarToSlot, faCircleQuestion, faQrcode, faShieldDog, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-get-token',
  templateUrl: './get-token.component.html',
  styleUrls: ['./get-token.component.scss']
})
export class GetTokenComponent implements OnInit {
  faCircleCheck = faCircleCheck;
  faQrcode = faQrcode;
  faBell = faBell;
  faShieldDog = faShieldDog;
  faShieldHalved = faShieldHalved;
  faCircleDollarToSlot = faCircleDollarToSlot;
  faCircleQuestion = faCircleQuestion;
  faCircleArrowLeft = faCircleArrowLeft;

  pet!: Pet;
  user: User | null;

  unknowError: boolean = false;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }

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
