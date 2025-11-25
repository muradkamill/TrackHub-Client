import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-rate',
  imports: [],
  templateUrl: './rate.html',
  styleUrl: './rate.css',
})
export class Rate {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  public globalvar = inject(Globalvar);

  product: any;
  productId: any;
  rate: number = 0;
  isRated: boolean = false;
  accessToken: any;
  rateIsEmpty: boolean = false;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((x) => {
      this.productId = x.get('productId');
      this.accessToken = x.get('accessToken');
      sessionStorage.setItem('accessToken', this.accessToken);
    });

    this.http.get(`${this.globalvar.BaseUrl}/Product/${this.productId}`).subscribe({
      next: (data: any) => {
        this.product = data;
      },
      error: (err) => console.error('Failed to load product', err),
    });


  }

  onSubmitRate(comment: string) {
    if (this.rate == 0) {
      this.rateIsEmpty = true;

      setTimeout(() => {
        this.rateIsEmpty = false;
      }, 1000);
      return;
    }
    var body = {
      productId: this.productId,
      productRate: this.rate,
      productComment: comment,
    };

    this.http.post<any>(`${this.globalvar.BaseUrl}/Customer/rate-product`, body).subscribe({
      next: () => {
        this.isRated = true;
        setTimeout(() => this.router.navigate(['']), 400);
      },
      error: (err) => console.log('Failed to submit rating', err),
    });
  }

  setRate(value: number) {
    this.rate = value;
  }

  getStarImage(starNumber: number): string {
    if (this.rate >= starNumber) {
      return 'star.png';
    } else if (this.rate >= starNumber - 0.5) {
      return 'halfstar.png';
    } else {
      return 'emptystar.png';
    }
  }
}
