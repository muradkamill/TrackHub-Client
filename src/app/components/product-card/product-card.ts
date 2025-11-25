import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard implements OnInit {
  private route = inject(Router);
  private http = inject(HttpClient);
  public globalvar = inject(Globalvar);

  products: any;

  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Product`).subscribe({
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
