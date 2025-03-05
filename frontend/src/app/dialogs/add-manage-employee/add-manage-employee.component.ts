import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../app.config';

@Component({
  selector: 'app-add-manage-employee',
  standalone: true,
  templateUrl: './add-manage-employee.component.html',
  styleUrls: ['./add-manage-employee.component.css'],
  imports: [FormsModule, CommonModule]
})
export class AddManageEmployeeComponent {
  name: string = '';
  jobTitle: string = '';
  departmentId: string = '';
  status: string = 'Active';
  actionType: string = '';
  departments: any[] = [];

  private employeeApiUrl = `${environment.BASE_API_URL}/api/employees`;
  private departmentApiUrl = `${environment.BASE_API_URL}/api/departments`;

  constructor(
    public dialogRef: MatDialogRef<AddManageEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.fetchDepartments();
    
    if (data.action === 'manage') {
      this.name = data.employee.name;
      this.jobTitle = data.employee.job_title;
      this.departmentId = data.employee.department._id;
      this.status = data.employee.status;
    }
    this.actionType = data.action;
  }

  fetchDepartments() {
    this.http.get<any[]>(this.departmentApiUrl, this.getAuthHeaders()).subscribe((response) => {
      this.departments = response;
    });
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

  saveEmployee() {
    const employeeData = {
      name: this.name,
      job_title: this.jobTitle,
      department: this.departmentId,
      status: this.status
    };

    if (this.actionType === 'add') {
      this.http.post(this.employeeApiUrl, employeeData, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    } else if (this.actionType === 'manage') {
      this.http.put(`${this.employeeApiUrl}/${this.data.employee._id}`, employeeData, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }

  deleteEmployee() {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${this.employeeApiUrl}/${this.data.employee._id}`, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
