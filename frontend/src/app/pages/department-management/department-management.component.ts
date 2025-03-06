import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddManageDepartmentComponent } from '../../dialogs/add-manage-department/add-manage-department.component';
import { environment } from '../../app.config';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-department-management',
  standalone: true,
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  imports: [RouterModule, CommonModule, FormsModule, MatTooltip]
})
export class DepartmentManagementComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  departments: any[] = [];
  filteredDepartments: any[] = [];
  searchQuery: string = '';

  private apiUrl = `${environment.BASE_API_URL}/api/departments`;

  constructor() {
    this.fetchDepartments();
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

  fetchDepartments() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe((response) => {
      this.departments = response;
      this.filteredDepartments = response;
    });
  }

  onSearchChange() {
    this.filteredDepartments = this.departments.filter(dept =>
      dept.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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
