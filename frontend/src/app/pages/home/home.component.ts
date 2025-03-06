import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../app.config';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private apiUrl = `${environment.BASE_API_URL}`;
  totalEmployees: number = 0;
  totalDepartments: number = 0;

  constructor(private router: Router,
              private http: HttpClient) {
    this.fetchStats();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  navigateToEmployees() {
    this.router.navigate(['/employees']);
  }
  fetchStats() {
    this.http.get<any[]>(`${this.apiUrl}/api/employees`, this.getAuthHeaders())
      .subscribe(data => this.totalEmployees = data.length);

    this.http.get<any[]>(`${this.apiUrl}/api/departments`, this.getAuthHeaders())
      .subscribe(data => this.totalDepartments = data.length);
  }

  navigateToDepartments() {
    this.router.navigate(['/departments']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
