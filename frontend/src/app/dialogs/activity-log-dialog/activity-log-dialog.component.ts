import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-log-dialog',
  templateUrl: './activity-log-dialog.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./activity-log-dialog.component.css']
})
export class ActivityLogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ActivityLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public log: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
