import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { Globalvar } from '../../services/globalvar';
import { Router } from '@angular/router';

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
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styles: '',
})
export class UserProfile implements OnInit {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  route = inject(Router);
  public globalvar = inject(Globalvar);
  products: any;
  balance: any;
  isOpenEdit: boolean = false;
  productName: string = '';
  isOpenAdd: boolean = false;
  editFormGroup!: FormGroup;
  addFormGroup!: FormGroup;
  changePasswordGroup!: FormGroup;
  courierApplication: any;
  person: any;
  isChangePassword: boolean = false;
  currentPasswordisWrong: boolean = false;
  isCourierApplication: boolean = false;
  courierApplicationForm!: FormGroup;
  selectedCvFile: any;
  isSubmitted: boolean = false;
  longitude: any;
  latitude: any;
  maxImages = 10;
  selectedImages: File[] = [];

  private map!: L.Map;
  private marker!: L.Marker;

  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Person/get-owner-products`).subscribe({
      next: (data) => {
        this.products = data;
        console.log(this.products);
      },
    });
    this.http.get<any>(`${this.globalvar.BaseUrl}/Person/get-balance`).subscribe({
      next: (data) => {
        this.balance = data.Balance;
      },
    });

    this.http.get<any>(`${this.globalvar.BaseUrl}/Courier`).subscribe({
      next: (data) => {
        this.courierApplication = data?.ApplicationStatus;
      },
    });

    this.http.get<any>(`${this.globalvar.BaseUrl}/Person`).subscribe({
      next: (data) => {
        this.person = data;
      },
    });
  }
  onClickProductDetail(productId: number) {
    this.route.navigate([`/product-detail/${productId}`]);
  }
  closeEditModal() {
    this.isOpenEdit = false;
    this.productName = '';
  }
  closeAddModal() {
    this.isOpenAdd = false;
  }
  openEditModal() {
    this.isOpenEdit = true;
  }
  openAddModal() {
    this.isOpenAdd = true;
    this.addFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(400)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stockQuantity: ['', [Validators.required, Validators.max(50), Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      isNew: [true, Validators.required],
      subCategoryName: ['', Validators.required],
      images: [null, Validators.required],
    });
    setTimeout(() => {
      this.initMap();
    }, 1);
  }
  private initMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map').setView([40.4093, 49.8671], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: defaultIcon }).addTo(this.map);
      }

      this.latitude = lat;
      this.longitude = lng;
      console.log('lat:');
      console.log(this.latitude);
      console.log('long:');
      console.log(this.longitude);
    });
  }
  onDelete(productName: string) {
    Swal.fire({
      title: `Delete "${productName}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      background: '#1e293b',
      color: '#f59e0b',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>(`${this.globalvar.BaseUrl}/Product/${productName}`).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: `"${productName}" has been removed.`,
              icon: 'success',
              background: '#1e293b',
              color: '#f59e0b',
              confirmButtonColor: '#f59e0b',
            });
            this.ngOnInit();
          },
        });
      }
    });
  }

  onEdit(product: any) {
    if (product.IsNew) {
      product.IsNew = true;
    } else {
      product.IsNew = false;
    }
    this.isOpenEdit = true;
    this.productName = product.Name;
    this.editFormGroup = this.fb.group({
      name: [product.Name, [Validators.required, Validators.maxLength(50)]],
      description: [product.Description, [Validators.required, Validators.maxLength(400)]],
      price: [product.Price, [Validators.required, Validators.min(1)]],
      stockQuantity: [
        product.StockQuantity,
        [Validators.required, Validators.max(50), Validators.min(1)],
      ],
      weight: [product.Weight, [Validators.required, Validators.min(0.1)]],
      isNew: [product.IsNew],
      subCategoryName: [product.SubCategoryName, Validators.required],
      images: [null, Validators.required],
    });
  }
  onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    if (files.length > this.maxImages) {
      Swal.fire({
        icon: 'error',
        title: 'Limit exceeded',
        text: `You can upload a maximum of ${this.maxImages} photos.`,
        background: '#1e293b',
        color: '#f59e0b',
        confirmButtonColor: '#f59e0b',
      });

      event.target.value = null;
      return;
    }

    this.editFormGroup.patchValue({
      images: Array.from(files),
    });
  }
  onFileChangeForAdd(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    if (files.length > this.maxImages) {
      Swal.fire({
        icon: 'error',
        title: 'Limit exceeded',
        text: `You can upload a maximum of ${this.maxImages} photos.`,
        background: '#1e293b',
        color: '#f59e0b',
        confirmButtonColor: '#f59e0b',
      });

      event.target.value = null;
      return;
    }

    this.selectedImages = Array.from(files);

    this.addFormGroup.patchValue({
      images: this.selectedImages,
    });
  }
  onSubmitAddProduct() {
    if (this.latitude === undefined || this.longitude === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please select a location on the map.',
        background: '#1e293b',
        color: '#f59e0b',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }
    if (this.addFormGroup.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('Name', this.addFormGroup.get('name')?.value);
    formData.append('Description', this.addFormGroup.get('description')?.value);
    formData.append('Price', this.addFormGroup.get('price')?.value.toString());
    formData.append('StockQuantity', this.addFormGroup.get('stockQuantity')?.value.toString());
    formData.append('IsNew', this.addFormGroup.get('isNew')?.value ? 'true' : 'false');
    formData.append('Weight', this.addFormGroup.get('weight')?.value.toString());
    formData.append('SubCategoryName', this.addFormGroup.get('subCategoryName')?.value);
    formData.append('Latitude', this.latitude);
    formData.append('Longitude', this.longitude);
    const files: FileList = this.addFormGroup.get('images')?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('Images', files[i]);
      }
    }
    this.http.post<any>(`${this.globalvar.BaseUrl}/Product`, formData).subscribe({
      next: () => {
        this.isOpenAdd = false;
        this.addFormGroup.reset();
        this.ngOnInit();
      },
    });
  }
  onSubmitEditProduct() {
    if (this.editFormGroup.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('NewProductName', this.editFormGroup.get('name')?.value);
    formData.append('Description', this.editFormGroup.get('description')?.value);
    formData.append('Price', this.editFormGroup.get('price')?.value.toString());
    formData.append('StockQuantity', this.editFormGroup.get('stockQuantity')?.value.toString());
    formData.append('Weight', this.editFormGroup.get('weight')?.value.toString());
    formData.append('IsNew', this.editFormGroup.get('isNew')?.value ? 'true' : 'false');
    formData.append('SubCategoryName', this.editFormGroup.get('subCategoryName')?.value);
    const files: FileList = this.editFormGroup.get('images')?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('Images', files[i]);
      }
    }

    this.http
      .put<any>(`${this.globalvar.BaseUrl}/Product/${this.productName}`, formData)
      .subscribe({
        next: () => {
          this.isOpenEdit = false;
          this.ngOnInit();
          this.editFormGroup.reset();
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.closeEditModal();
  }
  onChangePassword() {
    this.isChangePassword = true;
    this.changePasswordGroup = this.fb.group({
      currentPassword: ['', [Validators.minLength(8), Validators.required]],
      newPassword1: ['', [Validators.minLength(8), Validators.required]],
      newPassword2: ['', [Validators.minLength(8), Validators.required]],
    });
  }
  closeChangePassword() {
    this.isChangePassword = false;
  }
  onSubmitChangePassword() {
    this.currentPasswordisWrong = false;
    if (this.changePasswordGroup.invalid) {
      return;
    }
    var formData = new FormData();
    formData.append('CurrentPassword', this.changePasswordGroup.get('currentPassword')?.value);
    formData.append('NewPassword', this.changePasswordGroup.get('newPassword1')?.value);

    this.http.put<any>(`${this.globalvar.BaseUrl}/Person/update-password`, formData).subscribe({
      next: () => {
        this.isChangePassword = false;
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
        if (err.error[0] == 'Current Password is wrong!') {
          this.currentPasswordisWrong = true;
        }
      },
    });
  } 

  onCourierApplication() {
    this.isCourierApplication = true;
    this.courierApplicationForm = this.fb.group({
      cvFile: ['', Validators.required],
      vehicleType: ['', Validators.required],
    });
  }

  closeCourierApplication() {
    this.isCourierApplication = false;
  }
  onFileChangeForCourier(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedCvFile = event.target.files[0];
      this.courierApplicationForm.patchValue({
        cvFile: this.selectedCvFile,
      });
    }
  }

  onSubmitCourierApplication() {
    this.isSubmitted = true;
    if (this.courierApplicationForm.invalid) {
      return;
    }
    var formData = new FormData();
    formData.append('VehicleType', this.courierApplicationForm.get('vehicleType')?.value);
    formData.append('CvUrl', this.selectedCvFile);

    this.http
      .post<any>(`${this.globalvar.BaseUrl}/Person/create-courier-application`, formData)
      .subscribe({
        next: () => {
          this.isCourierApplication = false;
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onChangeProfilePhoto(event: any) {
    var file = event.target.files[0];
    if (!file) return;

    var formData = new FormData();
    formData.append('Image', file);
    this.http
      .put<any>(`${this.globalvar.BaseUrl}/Person/change-profile-photo`, formData)
      .subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
