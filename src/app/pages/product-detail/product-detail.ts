import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart';
import { Product } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product?: Product;
  similarProducts: Product[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.productService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product = product;
        this.loadSimilarProducts();
      },
      error: (error) => {
        console.error('Kunde inte hämta produkten:', error);
      }
    });
  }

  loadSimilarProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.similarProducts = products
          .filter((product) => product.slug !== this.product?.slug)
          .slice(0, 3);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Kunde inte hämta liknande produkter:', error);
      }
    });
  }

  addToCart(event: Event): void {
    event.preventDefault();

    if (this.product) {
      this.cartService.addToCart(this.product);
      alert(`${this.product.title} har lagts till i varukorgen!`);
    }
  }
}