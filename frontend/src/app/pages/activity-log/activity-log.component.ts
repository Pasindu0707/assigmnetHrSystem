import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // ✅ Import this to fix *ngIf and date pipe issues
import { environment } from '../../app.config';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css'],
  imports: [CommonModule]  // ✅ Include CommonModule for *ngIf, *ngFor, and pipes like 'date'
})
export class ActivityLogComponent {
  private http = inject(HttpClient);
  activityLogs: any[] = [];
  selectedLog: any = null;

  private apiUrl = `${environment.BASE_API_URL}/api/employees/logs`;

  constructor() {
    this.fetchActivityLogs();
  }

  /** Get authorization headers */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  /** Fetch employee activity logs */
  fetchActivityLogs() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe((response) => {
      this.activityLogs = response;
    }, error => {
      console.error('Error fetching logs:', error);
    });
  }

  /** Toggle log details */
  toggleDetails(log: any) {
    this.selectedLog = log;
  }

  /** Close details section */
  closeDetails() {
    this.selectedLog = null;
  }
}
