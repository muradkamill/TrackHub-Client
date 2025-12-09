import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globalvar {
  BaseUrl: string = 'http://trackhub.runasp.net/api';
  BaseUrlForImg: string = 'http://trackhub.runasp.net';

}
