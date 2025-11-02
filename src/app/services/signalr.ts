import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private hubConnection!: signalR.HubConnection;

async startConnection() {
    // if (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7115/hub/notifications', {
          accessTokenFactory: () => sessionStorage.getItem("accessToken")!
        })
        .withAutomaticReconnect()
        .build();

      try {
        await this.hubConnection.start();
      } catch (err) {
        console.error('❌ SignalR Connection Failed:', err);
      }
    // }
  }


  addRateCourierListener(callback: (data: any) => void): void {
    this.hubConnection.on('RateCourierPopup', (data) => {
      callback(data);
    });
  }
}
