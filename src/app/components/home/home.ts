import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globalvar } from '../../services/globalvar';
import { ProductCard } from "../../shared/product-card/product-card";

@Component({
  selector: 'home-card',
  imports: [ProductCard],
  templateUrl: './home.html',
  styles: ``,
})
export class Home implements OnInit {
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
