import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-page',
  imports: [],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage implements OnInit {
  http = inject(HttpClient);
  route = inject(Router);
  products: any;
  activatedRoute = inject(ActivatedRoute);
  categoryId!: string | null;
  subCategoryId!: string | null;
  categoryName: string = '';
  subCategoryName: string = '';

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.categoryId = params.get('categoryId');
      this.subCategoryId = params.get('subCategoryId');

      if (this.subCategoryId) {
        this.http
          .get(
            `https://localhost:7115/api/SubCategory/${this.subCategoryId}/get-subcategory-name`, { responseType: 'text' }
          )
          .subscribe({
            next: (data) => {
              this.subCategoryName = data;
            },
          });

        this.http
          .get<any>(
            `https://localhost:7115/api/SubCategory/${this.subCategoryId}/get-product-by-subcategory`
          )
          .subscribe({
            next: (data) => {
              this.products = data;
            },
          });
      } else {
        this.http
          .get(`https://localhost:7115/api/Category/${this.categoryId}/get-category-name`, { responseType: 'text' })
          .subscribe({
            next: (data) => {
              console.log(data)
              this.categoryName = data;
            },
          });

        this.http
          .get<any>(
            `https://localhost:7115/api/Category/${this.categoryId}/get-products-by-category`
          )
          .subscribe({
            next: (data) => {
              this.products = data;
            },
          });
      }
    });
  }
  onClick(productId:number) {
    this.route.navigate([`product-detail/${productId}`])
  }
  goShopping(){
    this.route.navigate([""])
  }
}
