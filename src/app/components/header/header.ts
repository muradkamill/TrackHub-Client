import { AuthService } from './../../services/auth-service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-header',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isAuth: boolean = false;
  private authService = inject(AuthService);
  public globalvar = inject(Globalvar);
  private http = inject(HttpClient);
  private route = inject(Router);
  private fb = inject(FormBuilder);
  hoverEl: boolean = false;
  isCourier: boolean = false;
  hoverSetTimeOut: any;
  showSignUpModal = false;
  showLoginModal = false;
  responseSignUp: string = '';
  showMyAccountModal = false;
  myAccountTimeout: any;
  activeCartsQuantity = 0;
  refreshToken: any;
  accessToken: any;
  profilePhotoUrl: any;
  isPasswordWrong: boolean = false;
  isFinWrong: boolean = false;
  signUpFormGroup!: FormGroup;

  ngOnInit(): void {
    this.refreshToken = sessionStorage.getItem('refreshToken');
    this.accessToken = sessionStorage.getItem('accessToken');
    if (this.accessToken) {
      this.http.get<any>(`${this.globalvar.BaseUrl}/Person`).subscribe({
        next: (data) => {
          this.profilePhotoUrl = data.ImageUrl;
        },
      });
    }

    if (this.refreshToken) {
      this.authService.refreshToken(this.refreshToken).subscribe({
        next: (data) => {
          this.isAuth = true;
          sessionStorage.setItem('accessToken', data.AccessToken);
          sessionStorage.setItem('refreshToken', data.RefreshToken);
        },
        error: (err) => {
          if (err.error[0]=='Refresh Token Expired') {
            this.authService.logout();
          }
        },
      });
    }
  }
  onHover() {
    clearTimeout(this.hoverSetTimeOut);
    this.hoverEl = true;
  }
  outHover() {
    this.hoverSetTimeOut = setTimeout(() => {
      this.hoverEl = false;
    }, 200);
  }
  onClickCart() {
    this.route.navigate(['cart']);
  }
  toHome() {
    this.route.navigate(['']);
  }

  openSignUpModal() {
    this.showSignUpModal = true;
    this.showLoginModal = false;
    this.signUpFormGroup = this.fb.group({
      fin: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      mail: ['', Validators.required, Validators.email],
      surName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    });
  }

  openLoginModal() {
    this.showLoginModal = true;
    this.showSignUpModal = false;
    this.isPasswordWrong = false;
    this.isFinWrong = false;
  }

  closeModal() {
    this.showSignUpModal = false;
    this.showLoginModal = false;
  }
  onSignUp() {
    if (this.signUpFormGroup.invalid) {
      return;
    }
    var body = {
      fin: this.signUpFormGroup.get('fin')?.value,
      password: this.signUpFormGroup.get('password')?.value,
      name: this.signUpFormGroup.get('name')?.value,
      mail: this.signUpFormGroup.get('mail')?.value,
      surName: this.signUpFormGroup.get('surName')?.value,
    };

    this.authService.signUp(body).subscribe({
      next: () => {
        console.log('success');
        this.responseSignUp = 'Registered Successfully!';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSignIn(fin: string, password: string) {
    this.authService.signIn(fin, password).subscribe({
      next: (data) => {
        sessionStorage.setItem('refreshToken', `${data.RefreshToken}`);
        sessionStorage.setItem('accessToken', `${data.AccessToken}`);
        this.accessToken = data.AccessToken;
        this.responseSignUp = 'Registered Successfully!';
        this.isAuth = true;
        this.closeModal();
        this.ngOnInit();

        const payload = JSON.parse(atob(this.accessToken.split('.')[1]));

        const role =
          payload?.role ||
          payload?.roles ||
          payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        if (role === 'Courier' || (Array.isArray(role) && role.includes('Courier'))) {
          this.isCourier = true;
        } else {
          this.isCourier = false;
        }
      },
      error: (err) => {
        console.log(err);
        if (err.error[0] == 'Password is wrong!') {
          this.isPasswordWrong = true;
        }
        if (err.error[0] == 'This Person is not Registered,Please Register and Login Later') {
          this.isFinWrong = true;
        }
      },
    });
  }

  onMyAccount() {
    clearTimeout(this.myAccountTimeout);
    this.showMyAccountModal = true;
  }
  outMyAccount() {
    this.myAccountTimeout = setTimeout(() => {
      this.showMyAccountModal = false;
    }, 200);
  }
  Logout() {
    this.authService.logout();
  }
  onCourierDashboard() {
    this.route.navigate(['courier']);
  }
  onUserDashboard() {
    this.route.navigate(['user-profile']);
  }
  onSearch(productName: string) {
    if (productName) {
      this.route.navigate([`/search/${productName}`]);
    }
  }
}
