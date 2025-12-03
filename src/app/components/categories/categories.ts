import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styles: '',
})
export class Categories implements OnInit {
  categories: any;
  subCategories: any;
  hoverEl: boolean = false;
  hoverTimeout: any;
  private http = inject(HttpClient);
  private route = inject(Router);
  private globalvar = inject(Globalvar);

  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Category`).subscribe({
      next: (data) => {
        this.categories = data;
      },
    });

    this.http.get<any>(`${this.globalvar.BaseUrl}/SubCategory`).subscribe({
      next: (data) => {
        this.subCategories = data;
      },
    });
  }
  onHover() {
    clearTimeout(this.hoverTimeout);
    this.hoverEl = true;
  }
  outHover() {
    this.hoverTimeout = setTimeout(() => {
      this.hoverEl = false;
    }, 200);
  }
  closeModal() {
    this.hoverEl = false;
    clearTimeout(this.hoverTimeout);
  }

  getSubCategories(categoryName: string) {
    return this.subCategories.filter((x: any) => x.CategoryName === categoryName);
  }
  onClickCategory(categoryName: string) {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Category/${categoryName}`).subscribe({
      next: (data) => {
        this.subCategories = data;
        this.outHover();
        this.closeModal();
      },
    });
  }
  onClickSubCategory(subCategoryName: string) {
    this.http.get<any>(`${this.globalvar.BaseUrl}/SubCategory/${subCategoryName}`).subscribe({
      next: (data) => {
        this.subCategories = data;
        this.outHover();
        this.closeModal();
      },
    });
  }
  getProducts(categoryId: number) {
    this.http
      .get<any>(`${this.globalvar.BaseUrl}/Category/${categoryId}/get-products-by-category`)
      .subscribe({
        next: () => {
          this.route.navigate([`/category-page/${categoryId}`]);
          this.closeModal();
        },
      });
  }
  getProductsBySubcategory(subCategoryId: number, categoryId: number) {
    this.http.get<any>(`${this.globalvar.BaseUrl}/SubCategory/${subCategoryId}/get-product-by-subcategory`)
        .subscribe({
        next: () => {
          this.route.navigate([`/category-page/${categoryId}/${subCategoryId}`]);
          this.closeModal();
        },
      });
  }

}
