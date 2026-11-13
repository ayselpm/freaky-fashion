import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { AdminProducts } from './pages/admin-products/admin-products';
import { AdminNewProduct } from './pages/admin-new-product/admin-new-product';
import { Search } from './pages/search/search';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products/:slug', component: ProductDetail },
  { path: 'search', component: Search },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'admin', component: AdminProducts },
  { path: 'admin/products', component: AdminProducts },
  { path: 'admin/products/new', component: AdminNewProduct }
];