import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  products: any[] = [];

  hero = {
    title: 'Freaky Fashion',
    text: 'Upptäck vår senaste kollektion',
    imageUrl: '/images/hero.png'
  };

  spots = [
    {
      title: 'Nyheter',
      imageUrl: '/images/spot-news.png',
      link: '/'
    },
    {
      title: 'Rea',
      imageUrl: '/images/spot-sale.png',
      link: '/'
    },
    {
      title: 'Kampanjer',
      imageUrl: '/images/spot-campaign.png',
      link: '/'
    }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/products')
      .subscribe({
        next: (products) => {
          this.products = products.slice(0, 8);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Kunde inte hämta produkter:', error);
        }
      });
  }
}