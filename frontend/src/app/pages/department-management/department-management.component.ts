import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddManageDepartmentComponent } from '../../dialogs/add-manage-department/add-manage-department.component';
import { environment } from '../../app.config';


@Component({
  selector: 'app-department-management',
  standalone: true,
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  imports: [RouterModule, CommonModule, FormsModule]
})
export class DepartmentManagementComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  departments: any[] = [];
  searchQuery: string = '';
  paginatedDepartments: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  private apiUrl = `${environment.BASE_API_URL}/api/departments`;

  constructor() {
    this.fetchDepartments();
  }
  /** Get the authorization headers */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
  fetchDepartments() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe((response) => {  
      this.departments = response;
      this.updatePagination();
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const filtered = this.departments.filter((dept) =>
      dept.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.paginatedDepartments = filtered.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openDepartmentDialog(department: any | null, action: string) {
    const dialogRef = this.dialog.open(AddManageDepartmentComponent, {
      width: '500px',
      data: { department, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.fetchDepartments();
      }
    });
  }
}
