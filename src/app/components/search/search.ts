import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private route = inject(Router);
  productName: any;
  products: any;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((x) => {
      this.productName = x.get('productName');
    });
    this.http.get<any>(`https://localhost:7115/api/Product/${this.productName}`).subscribe({
      next: (data) => {
        this.products = data;
        console.log(data);
      },
    });
  }

  onClick(productId: number) {
    this.route.navigate([`product-detail/${productId}`]);
  }
}
