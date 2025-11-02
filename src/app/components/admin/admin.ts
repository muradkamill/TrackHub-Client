import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
  pendingCourierApplications: any;
  suggestions: any;
  ngOnInit(): void {
    this.http.get<any>('https://localhost:7115/api/Admin/pending-courier-application').subscribe({
      next: (data) => {
        this.pendingCourierApplications = data;
        console.log(data)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.http.get<any>('https://localhost:7115/api/Admin/get-suggestions').subscribe({
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
    this.http.put<any>('https://localhost:7115/api/Admin/approve-application', body).subscribe({
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
    this.http.put<any>('https://localhost:7115/api/Admin/reject-application', body).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
