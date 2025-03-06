import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../app.config';
import { AddManageEmployeeComponent } from '../../dialogs/add-manage-employee/add-manage-employee.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css'],
  imports: [FormsModule, CommonModule, MatDialogModule]
})
export class EmployeeManagementComponent {
  employees: any[] = [];
  paginatedEmployees: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  searchTimeout: any;
  totalEmployees: number = 0;
  defaultProfileImage: string = 'jand'

  private apiUrl = `${environment.BASE_API_URL}/api/employees`;

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {
    this.fetchEmployees();
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

  /** Fetch all employees */
  fetchEmployees() {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe((response) => {
      this.employees = response.map(emp => ({
        ...emp,
        profilePicture: emp.profilePicture && emp.profilePicture.startsWith('data:image')
          ? emp.profilePicture
          : this.defaultProfileImage
      }));
      this.totalEmployees = response.length;
      this.calculatePagination();
    });
  }


  /** Calculate pagination */
  calculatePagination() {
    this.totalPages = Math.ceil(this.employees.length / this.pageSize);
    this.updatePaginatedEmployees();
  }

  /** Update paginated list */
  updatePaginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.employees.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEmployees();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEmployees();
    }
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchEmployees();
    }, 2000);
  }

  searchEmployees() {
    if (this.searchQuery.trim() === '') {
      this.fetchEmployees();
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/search?query=${this.searchQuery}`, this.getAuthHeaders())
      .subscribe((response) => {
        this.employees = response.map(emp => ({
          ...emp,
          profilePicture: emp.profilePicture && emp.profilePicture.startsWith('data:image')
            ? emp.profilePicture
            : this.defaultProfileImage
        }));
        this.currentPage = 1;
        this.calculatePagination();
      });
  }


  openEmployeeDialog(employeeData: any, action: 'add' | 'manage') {
    const dialogRef = this.dialog.open(AddManageEmployeeComponent, {
      width: '800px',
      data: { employee: employeeData, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.fetchEmployees();
      }
    });
  }

  /** Navigate back to home */
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  getEmployeeLogs() {
    this.router.navigate(['/activityLog']);
  }

  // /** Convert Image to Base64 */
  // handleFileInput(event: any, employee: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       employee.profile_picture = reader.result as string;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
}
