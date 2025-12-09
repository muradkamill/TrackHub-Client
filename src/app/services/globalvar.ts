import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globalvar {
  BaseUrl: string = 'https://trackhub.runasp.net/api';
  BaseUrlForImg: string = 'https://trackhub.runasp.net';

}
