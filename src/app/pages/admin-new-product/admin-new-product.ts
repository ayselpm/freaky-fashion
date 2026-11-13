import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-new-product.html',
  styleUrl: './admin-new-product.css'
})
export class AdminNewProduct {

  newProduct = {
    title: '',
    description: '',
    sku: '',
    imageUrl: '',
    price: null as number | null,
    brand: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  addProduct(): void {
    this.http
      .post('http://localhost:3000/api/products', this.newProduct)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Produkten kunde inte sparas:', error);
        }
      });
  }
}