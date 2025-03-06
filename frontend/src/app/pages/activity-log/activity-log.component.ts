import {Component, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {environment} from '../../app.config';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ActivityLogDialogComponent} from '../../dialogs/activity-log-dialog/activity-log-dialog.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ActivityLogComponent {
  private http = inject(HttpClient);
  activityLogs: any[] = [];
  filteredLogs: any[] = [];
  paginatedLogs: any[] = [];
  searchQuery: string = '';

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  private apiUrl = `${environment.BASE_API_URL}/api/employees/logs`;

  constructor(private router: Router, private dialog: MatDialog) {
    this.fetchActivityLogs();
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

  fetchActivityLogs() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe(
      (response) => {
        this.activityLogs = response;
        this.filteredLogs = [...this.activityLogs];
        this.currentPage = 1;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching logs:', error);
      }
    );
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredLogs = [...this.activityLogs];
    } else {
      this.filteredLogs = this.activityLogs.filter(log =>
        (log.changes?.before?.name || log.changes?.after?.name || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize);
    this.paginatedLogs = this.getPaginatedData();
  }

  getPaginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(startIndex, startIndex + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedLogs = this.getPaginatedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedLogs = this.getPaginatedData();
    }
  }

  openDetailsDialog(log: any) {
    this.dialog.open(ActivityLogDialogComponent, {
      width: '600px',
      data: log
    });
  }

  backtoEmployee() {
    this.router.navigate(['/employees']);
  }

  getBadgeClass(action: string): string {
    switch (action.toLowerCase()) {
      case 'created':
        return 'badge-success';
      case 'updated':
        return 'badge-warning';
      case 'deleted':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
