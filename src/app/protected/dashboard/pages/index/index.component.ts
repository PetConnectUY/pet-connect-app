import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RotateProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch, faDog, faPaw, faQrcode } from '@fortawesome/free-solid-svg-icons';
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

  totalPets!: number;
  totalTokens!: number;

  constructor(
    private userService: UserService,
  ){}

  ngOnInit(): void {
    this.userService.getStatistics().subscribe({
      next: (res) => {
        this.totalPets = res.total_pets;
        this.totalTokens = res.total_tokens;
      },
      error: (error: HttpErrorResponse) => {
        this.totalPets = NaN;
        this.totalTokens = NaN;
      }
    })
  }

}
