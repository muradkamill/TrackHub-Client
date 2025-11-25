import { Globalvar } from './../../services/globalvar';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{
  private http = inject(HttpClient);
  public globalvar = inject(Globalvar);

  pendingCourierApplications: any;
  suggestions: any;
  ngOnInit(): void {
    this.http.get<any>(`${this.globalvar.BaseUrl}/Admin/pending-courier-application`).subscribe({
      next: (data) => {
        this.pendingCourierApplications = data;
        console.log(data)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.http.get<any>(`${this.globalvar.BaseUrl}/Admin/get-suggestions`).subscribe({
      next: (data) => {
        this.suggestions = data;
        console.log(data)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  approvePendingApplication(fin: string) {
    var body = {
      personFin: fin,
    };
    this.http.put<any>(`${this.globalvar.BaseUrl}/Admin/approve-application`, body).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  rejectPendingApplication(fin: string) {
    var body = {
      personFin: fin,
    };
    this.http.put<any>(`${this.globalvar.BaseUrl}/Admin/reject-application`, body).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
