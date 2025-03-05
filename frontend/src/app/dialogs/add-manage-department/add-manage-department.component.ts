import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../app.config';

@Component({
  selector: 'app-add-manage-department',
  standalone: true,
  templateUrl: './add-manage-department.component.html',
  styleUrls: ['./add-manage-department.component.css'],
  imports: [FormsModule, CommonModule]
})
export class AddManageDepartmentComponent {
  name: string = '';
  description: string = '';
  actionType: string = '';

  private apiUrl = `${environment.BASE_API_URL}/api/departments`;

  constructor(
    public dialogRef: MatDialogRef<AddManageDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    if (data.action === 'manage') {
      this.name = data.department.name;
      this.description = data.department.description;
    }
    this.actionType = data.action;
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

  /** Add or Update department */
  saveDepartment() {
    const departmentData = {
      name: this.name,
      description: this.description
    };

    if (this.actionType === 'add') {
      this.http.post(this.apiUrl, departmentData, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    } else if (this.actionType === 'manage') {
      this.http.put(`${this.apiUrl}/${this.data.department._id}`, departmentData, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }

  /** Delete department */
  deleteDepartment() {
    if (confirm(`Are you sure you want to delete the department: ${this.name}?`)) {
      this.http.delete(`${this.apiUrl}/${this.data.department._id}`, this.getAuthHeaders()).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
