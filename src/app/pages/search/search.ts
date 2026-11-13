import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  products: any[] = [];
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('q') || '';
      this.searchProducts();
    });
  }

  searchProducts(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/products')
      .subscribe({
        next: (products) => {
          const term = this.searchTerm.toLowerCase().trim();

          this.products = products.filter((product) =>
            product.title.toLowerCase().includes(term)
          );

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Kunde inte söka efter produkter:', error);
        }
      });
  }
}