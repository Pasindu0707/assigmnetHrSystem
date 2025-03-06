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
  profilePicture: string = '';  // Base64 string
  defaultProfilePicture: string =  'sd';

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
      this.profilePicture = data.employee.profilePicture || this.defaultProfilePicture;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.resizeImage(e.target.result, 300, 300, (resizedImage) => {
          this.profilePicture = resizedImage; // ✅ Use compressed image
        });
      };
      reader.readAsDataURL(file);
    }
  }

  /** Resize Image to Reduce Size */
  resizeImage(base64Str: string, maxWidth: number, maxHeight: number, callback: (resized: string) => void) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Set max dimensions
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height *= maxWidth / width));
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width *= maxHeight / height));
        height = maxHeight;
      }

      // Resize image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert back to Base64
      callback(canvas.toDataURL("image/jpeg", 0.7)); // 70% Quality
    };
  }


  saveEmployee() {
    const employeeData = {
      name: this.name,
      job_title: this.jobTitle,
      department: this.departmentId,
      status: this.status,
      profilePicture: this.profilePicture  // Include Base64 image
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
