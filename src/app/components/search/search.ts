import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { Globalvar } from '../../services/globalvar';
import { ProductCard } from "../../shared/product-card/product-card";

@Component({
  selector: 'app-search',
  imports: [ProductCard],
  templateUrl: './search.html',
  styles: '',
})
export class Search implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public globalvar = inject(Globalvar);
  private route = inject(Router);
  productName: any;
  products: any;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((x) => {
      this.productName = x.get('productName');

      this.http.get<any>(`${this.globalvar.BaseUrl}/Product/${this.productName}`).subscribe({
        next: (data) => {
          this.products = data;
        },
      });
    });
  }

  onClick(productId: number) {
    this.route.navigate([`product-detail/${productId}`]);
  }
}
