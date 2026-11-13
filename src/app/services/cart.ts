import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];

  getItems(): any[] {
    return this.items;
  }

  addToCart(product: any): void {
    this.items.push(product);
  }

  clearCart(): void {
    this.items = [];
  }
}