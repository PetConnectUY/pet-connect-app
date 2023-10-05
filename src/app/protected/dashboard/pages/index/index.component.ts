import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RotateProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch, faDog, faEllipsisVertical, faPaw, faPen, faQrcode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Pet } from 'src/app/protected/pets/interfaces/pet.interface';
import { PetPagination } from 'src/app/protected/pets/interfaces/pet.pagination.interface';
import { PetService } from 'src/app/protected/pets/services/pet.service';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{

  faPaw = faPaw;
  faDog = faDog;
  faQrcode = faQrcode;
  faCircleNotch = faCircleNotch;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;

  totalPets!: number;
  totalTokens!: number;
  counterLoader: boolean = true;
  pets!: PetPagination;

  constructor(
    private userService: UserService,
    private petService: PetService,
  ){
    this.petService.getPets().subscribe({
      next: (pets: PetPagination) => {
        this.pets = pets;
      }
    })
  }

  ngOnInit(): void {
    this.counterLoader = true;
    this.userService.getStatistics().subscribe({
      next: (res) => {
        this.totalPets = res.total_pets;
        this.totalTokens = res.total_tokens;
        this.counterLoader = false;
      },
      error: (error: HttpErrorResponse) => {
        this.totalPets = NaN;
        this.totalTokens = NaN;
        this.counterLoader = true;
      }
    })
  }

}
