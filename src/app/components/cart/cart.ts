import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { Globalvar } from '../../services/globalvar';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-cart',
  imports: [FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private map!: L.Map;
  private marker!: L.Marker;
  openPayment: boolean = false;
  selectedVehicle: string = '';
  http = inject(HttpClient);
  public globalvar = inject(Globalvar);

  route = inject(Router);
  carts: any;
  productQuantity: any;
  price: number = 0;
  selectedCoords: { lat: number; lon: number } | null = null;

  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Cart`).subscribe({
      next: (carts) => {
        this.carts = carts;
        console.log(carts);
        this.price = 0;
        for (let cart of carts) {
          if (cart.IsSelected) {
            this.price += cart.Price;
          }
        }
      },
      error: (err) => console.log(err),
    });
  }

  onProduct(productId: number) {
    this.route.navigate([`product-detail/${productId}`]);
  }
  onDelete(productName: string) {
    const body = {
      productName: `${productName}`,
    };
    this.http.delete<any>(`${this.globalvar.BaseUrl}/Cart`, { body }).subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }
  onChange(cartId: number) {
    const body = {
      cartId: `${cartId}`,
    };
    this.http.put<any>(`${this.globalvar.BaseUrl}/Cart/change-cart-select`, body).subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }

  minusNumber(productQuantity: number, cartId: number) {
    const body = {
      cartId: cartId,
      quantity: productQuantity - 1,
    };
    if (productQuantity - 1 > 0) {
      this.http.put<any>(`${this.globalvar.BaseUrl}/Cart/update-cart`, body).subscribe({
        next: () => {
          this.price = 0;
          this.ngOnInit();
        },
      });
    }
  }
  plusNumber(productQuantity: number, stockQuantity: number, cartId: number) {
    const body = {
      cartId: cartId,
      quantity: productQuantity + 1,
    };
    if (productQuantity + 1 <= stockQuantity) {
      this.http.put<any>(`${this.globalvar.BaseUrl}/Cart/update-cart`, body).subscribe({
        next: () => {
          this.price = 0;
          this.ngOnInit();
        },
      });
    } else {
    }
  }
  confirmOrder() {
    this.openPayment = true;

    setTimeout(() => {
      if (!this.map) {
        this.map = L.map('map').setView([40.4093, 49.8671], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
          const lat = e.latlng.lat;
          const lon = e.latlng.lng;
          this.selectedCoords = { lat, lon };

          if (this.marker) {
            this.map!.removeLayer(this.marker);
          }

          this.marker = L.marker([lat, lon], { icon: defaultIcon }).addTo(this.map!);
        });
      }
    }, 1);
  }
  closePayment() {
    this.openPayment = false;
  }
  createOrder() {
    const body = {
      vehicleType: this.selectedVehicle,
      latitude: this.selectedCoords?.lat,
      longitude: this.selectedCoords?.lon,
    };
    this.http.post<any>(`${this.globalvar.BaseUrl}/Cart/order-cart`, body).subscribe({
      next: () => {
        this.openPayment = false;
        Swal.fire({
          title: 'Success!',
          text: 'Order placed successfully!',
          icon: 'success',
          background: '#1e293b',
          color: '#f59e0b',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'OK',
        });
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
