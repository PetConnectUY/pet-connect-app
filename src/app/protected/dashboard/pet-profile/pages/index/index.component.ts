import { Component, OnInit } from '@angular/core';
import { faEllipsisVertical, faEyeSlash, faGears, faPen, faQrcode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../interfaces/pet.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PetPagination } from '../../interfaces/pet.pagination.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  faQrcode = faQrcode;
  faGears = faGears;
  faPen = faPen;
  faEyeSlash = faEyeSlash;
  faTrash = faTrash;
  faEllipsisVertical = faEllipsisVertical;

  user: User|null;
  pets!: PetPagination;

  constructor(
    private authService: AuthService,
    private petService: PetService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.petService.getPets().subscribe({
      next: (res: PetPagination) => {
        this.pets = res;
        console.log(this.pets);
        
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        
      }
    })
  }
}
