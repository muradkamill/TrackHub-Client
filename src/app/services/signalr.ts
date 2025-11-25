import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Globalvar } from './globalvar';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private hubConnection!: signalR.HubConnection;
  private globalvar=inject(Globalvar);

async startConnection() {
    // if (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.globalvar.BaseUrl}/hub/notifications`, {
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
