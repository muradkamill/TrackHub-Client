import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-courier',
  imports: [FormsModule, CommonModule],
  templateUrl: './courier.html',
  styles: '',
})
export class Courier implements OnInit {
  selectedVehicle: any;
  http = inject(HttpClient);
  cv: any;
  applicationStatus: string = 'Applied';
  pendingCarts: any;
  activeCarts: any;
  deliveredCarts: any;
  balance: any;
  private globalvar = inject(Globalvar);


  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Courier/get-active-carts`).subscribe({
      next: (data) => {
        this.activeCarts = data;
      },
    });
    this.http.get<any>(`${this.globalvar.BaseUrl}/Person/get-balance`).subscribe({
      next: (data) => {
        this.balance = data.Balance;
      },
      error: (err) => console.log(err),
    });
    this.http.get<any>(`${this.globalvar.BaseUrl}/Courier/get-pending-carts`).subscribe({
      next: (data) => {
        this.pendingCarts = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.http.get<any>(`${this.globalvar.BaseUrl}/Courier/get-delivered-carts`).subscribe({
      next: (data) => {
        this.deliveredCarts = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  markAsDelivered(cartId: number) {
    console.log(cartId);
    var body = {
      cartId: cartId,
    };
    this.http.put<any>(`${this.globalvar.BaseUrl}/Courier/delivery-cart`, body).subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }
  acceptOrder(cartId: number, courierFee: number) {
    var body = {
      cartId: cartId,
      courierFee: courierFee,
    };
    this.http.put<any>(`${this.globalvar.BaseUrl}/Courier/confirm-pending-cart`, body).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('CvUrl', this.cv);
    this.http
      .post<any>(
        `${this.globalvar.BaseUrl}/Person/create-courier-application?VehicleType=${this.selectedVehicle}`,
        formData
      )
      .subscribe({
        next: () => {
          console.log('success');
        },
      });
  }
  onFileSelected(files: FileList | null) {
    if (!files || files.length === 0) {
      this.cv = null;
      return;
    }
    this.cv = files[0];
  }
}

