import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import Swal from 'sweetalert2';

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
  selector: 'app-product-details',
  imports: [FormsModule, DatePipe],
  templateUrl: './product-details.html',
  styles: ``,
})
export class ProductDetails {
  number: number = 0;
  route = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  productId: string | null = '';
  product: any;
  quantity: number = 1;
  commentsDatas: any;
  isCommentWrited: boolean = false;
  longitude: any;
  latitude: any;
  isMapClosed: boolean = true;

  map: any;
  mapInitialized = false;

  private http = inject(HttpClient);
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((x) => {
      this.productId = x.get('productId');
    });
    this.http.get<any>(`https://localhost:7115/api/Product/${this.productId}`).subscribe({
      next: (data) => {
        this.product = data;
        console.log(data);
        (this.latitude = data.Latitude), (this.longitude = data.Longitude);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.http
      .get<any>(`https://localhost:7115/api/Product/get-comments/${this.productId}`)
      .subscribe({
        next: (data) => {
          this.commentsDatas = data;
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  minusNumber() {
    if (this.quantity - 1 >= 1) {
      this.quantity -= 1;
    }
  }
  addNumber() {
    if (this.quantity + 1 <= this.product.StockQuantity) {
      this.quantity += 1;
    }
  }
  addToCart(productName: string, quantity: number) {
    const body = {
      productName: `${productName}`,
      quantity: quantity,
    };
    this.http.post<any>('https://localhost:7115/api/Cart', body).subscribe({
      next: () => {
        Swal.fire({
          title: 'Added to Cart!',
          text: `${quantity} ${productName} added to cart!`,
          icon: 'success',
          background: '#1e293b',
          color: '#f59e0b',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
      },
      error: (err) => {
        if (err == 'Unauthorized access!') {
          Swal.fire({
            title: 'Authentication Required',
            text: 'Please log in to continue!',
            icon: 'warning',
            background: '#1e293b',
            color: '#f59e0b',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'OK',
          });
        }
      },
    });
  }

  onSend(comment: string) {
    var body = {
      productId: this.productId,
      comment: comment,
    };
    this.http.post<any>('https://localhost:7115/api/Person/create-comment', body).subscribe({
      next: () => {
        this.isCommentWrited = true;
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showLocation() {
    this.isMapClosed = false;

    setTimeout(() => {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) return;

      if (this.mapInitialized) {
        this.map.setView([this.latitude, this.longitude], 13);
        return;
      }

      this.map = L.map('map').setView([this.latitude, this.longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker([this.latitude, this.longitude])
        .addTo(this.map)
        .bindPopup(`${this.product.OwnerName} ${this.product.OwnerSurname}'s Location`)
        .openPopup();

      this.map.scrollWheelZoom.disable();
      this.map.dragging.disable();
      this.map.zoomControl.remove();

      this.mapInitialized = true;
    }, 100);
  }
  closeMap() {
    this.isMapClosed = true;
  }
}
