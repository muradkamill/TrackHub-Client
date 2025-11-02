import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard implements OnInit {
  private route = inject(Router);
  private http = inject(HttpClient);
  products: any;

  ngOnInit(): void {
    this.http.get<any>('https://localhost:7115/api/Product').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onClick(productId: number) {
    this.route.navigate([`/product-detail/${productId}`]);
  }
}
