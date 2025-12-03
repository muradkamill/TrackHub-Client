import { Routes } from '@angular/router';
import { Cart } from './components/cart/cart';
import { ProductDetails } from './components/product-details/product-details';
import { CategoryPage } from './components/category-page/category-page';
import { Courier } from './components/courier/courier';
import { UserProfile } from './components/user-profile/user-profile';
import { Rate } from './components/rate/rate';
import { Search } from './components/search/search';
import { Error } from './components/error/error';
import { Admin } from './components/admin/admin';
import { Home } from './components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'product-detail',
    component: ProductDetails,
  },
  {
    path: 'product-detail/:productId',
    component: ProductDetails,
  },
  {
    path: 'category-page',
    component: CategoryPage,
  },
  {
    path: 'category-page/:categoryId',
    component: CategoryPage,
  },
  {
    path: 'category-page/:categoryId/:subCategoryId',
    component: CategoryPage,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'courier',
    component: Courier,
  },
  {
    path: 'rate',
    component: Rate,
  },
  {
    path: 'rate/:productId/:accessToken',
    component: Rate,
  },
  {
    path: 'search',
    component: Search,
  },
  {
    path: 'search/:productName',
    component: Search,
  },
  {
    path: 'user-profile',
    component: UserProfile,
  },
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: '**',
    component: Error,
  },
];
