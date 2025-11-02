import { Signalr } from './services/signalr';

import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Categories } from './components/categories/categories';
import { Footer } from './components/footer/footer';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Categories, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('TrackHub');
  data: any;
  accessToken: any;
  refreshToken: any;

  private authService = inject(AuthService);
  private signalRService = inject(Signalr);
  async ngOnInit(): Promise<void> {
    this.accessToken = sessionStorage.getItem('accessToken');
    await this.signalRService.startConnection();

    this.signalRService.addRateCourierListener(async (data) => {
      this.data = data;

      Swal.fire({
        title: 'Rate Courier',
        text: data.message,
        icon: 'info',
        confirmButtonText: 'OK',
      });
    });
  }
}
