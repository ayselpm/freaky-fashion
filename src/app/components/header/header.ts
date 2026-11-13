import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  searchTerm = '';

  constructor(private router: Router) {}

  search(): void {
    const term = this.searchTerm.trim();

    if (term) {
      this.router.navigate(['/search'], {
        queryParams: { q: term }
      });
    }
  }
}