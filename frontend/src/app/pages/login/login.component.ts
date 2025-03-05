import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../app.config'; // ✅ Import the BASE_API_URL

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private apiUrl = `${environment.BASE_API_URL}/auth`; // ✅ Use the base API URL

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Both fields are required!';
      return;
    }

    const loginData = { user: this.username, pwd: this.password };

    this.http.post<any>(this.apiUrl, loginData).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Invalid username or password!';
      }
    );
  }

  onReset() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }
}
