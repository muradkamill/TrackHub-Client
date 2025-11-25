import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Globalvar {
  BaseUrl: string = 'https://localhost:7115/api';
  BaseUrlForImg: string = 'https://localhost:7115';

}
