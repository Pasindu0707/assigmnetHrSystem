import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../app.config';
import { ToastrService } from 'ngx-toastr';

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

  private apiUrl = `${environment.BASE_API_URL}/auth`;

  constructor(private http: HttpClient,
              private toastr: ToastrService,
              private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Both fields are required!';
      return;
    }

    const loginData = { user: this.username, pwd: this.password };

    this.http.post<any>(this.apiUrl, loginData).subscribe(
      (response) => {
        if (response.accessToken) {
          // this.toastr.success('Login Successful!', 'Welcome');
          localStorage.setItem('token', response.accessToken);
          this.router.navigate(['/home']);
        } else {
          // this.toastr.error('Invalid username or password', 'Login Failed');
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
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
