import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(authService: AuthService) {
    this.isAuth = authService.isAuthenticated();
  }
  isAuth: any;
  private http = inject(HttpClient);
  response = '';

  onClickSuggestion(suggestion: string) {
    const body = {
      suggestion: `${suggestion}`,
    };
    this.http.post<any>('https://localhost:7115/api/Person/suggestion-admin', body).subscribe({
      next: (res) => {
        this.response = 'Thanks! Your feedback helps us improve the site';
      },
    });
  }
}
