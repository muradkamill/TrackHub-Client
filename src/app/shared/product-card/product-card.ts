import { Component, inject, Input } from '@angular/core';
import { Globalvar } from '../../services/globalvar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard {
  @Input() product: any;
  public globalvar = inject(Globalvar);
  public route = inject(Router);

  onClick(productId: number) {
    this.route.navigate([`/product-detail/${productId}`]);
  }
}
