import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { PetPagination } from 'src/app/protected/pets/interfaces/pet.pagination.interface';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  recentPets!: PetPagination;
  isLoading = true;

  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
    this.loadRecentPets();
  }

  loadRecentPets(): void {
    this.feedService.getPetsToFeed().subscribe((pets: PetPagination) => {
      this.recentPets = pets;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }
}
