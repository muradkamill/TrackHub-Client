import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Globalvar } from '../../services/globalvar';
import { ProductCard } from "../../shared/product-card/product-card";

@Component({
  selector: 'app-category-page',
  imports: [ProductCard],
  templateUrl: './category-page.html',
  styles: '',
})
export class CategoryPage implements OnInit {
  http = inject(HttpClient);
  route = inject(Router);
  products: any;
  activatedRoute = inject(ActivatedRoute);
  public globalvar = inject(Globalvar);
  categoryId!: string | null;
  subCategoryId!: string | null;
  categoryName: any;
  subCategoryName: any;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.categoryId = params.get('categoryId');
      this.subCategoryId = params.get('subCategoryId');

      if (this.subCategoryId) {
        this.http
          .get(`${this.globalvar.BaseUrl}/SubCategory/${this.subCategoryId}/get-subcategory-name`, {
            responseType: 'text',
          })
          .subscribe({
            next: (data) => {
              this.subCategoryName = data;
            },
          });

        this.http
          .get<any>(
            `${this.globalvar.BaseUrl}/SubCategory/${this.subCategoryId}/get-product-by-subcategory`
          )
          .subscribe({
            next: (data) => {
              this.products = data;
            },
          });
      } else {
        this.http
          .get(`${this.globalvar.BaseUrl}/Category/${this.categoryId}/get-category-name`, {
            responseType: 'text',
          })
          .subscribe({
            next: (data) => {
              this.categoryName = data;
            },
          });

        this.http
          .get<any>(
            `${this.globalvar.BaseUrl}/Category/${this.categoryId}/get-products-by-category`
          )
          .subscribe({
            next: (data) => {
              this.products = data;
            },
          });
      }
    });
  }
  onClick(productId: number) {
    this.route.navigate([`product-detail/${productId}`]);
  }
  goShopping() {
    this.route.navigate(['']);
  }
}
