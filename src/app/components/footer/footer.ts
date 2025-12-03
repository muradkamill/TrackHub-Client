import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Globalvar } from '../../services/globalvar';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styles: '',
})
export class Footer {
  constructor(authService: AuthService) {
    this.isAuth = authService.isAuthenticated();
  }
  isAuth: any;
  private http = inject(HttpClient);
  private globalvar = inject(Globalvar);

  response = '';

  onClickSuggestion(suggestion: string) {
    const body = {
      suggestion: `${suggestion}`,
    };
    this.http.post<any>(`${this.globalvar.BaseUrl}/Person/suggestion-admin`, body).subscribe({
      next: (res) => {
        this.response = 'Thanks! Your feedback helps us improve the site';
      },
    });
  }
}
