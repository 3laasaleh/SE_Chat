// notification-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent {
  message: string; // Define the message property here
  copied: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NotificationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private clipboard: Clipboard
  ) {
    // Initialize the message property with the data from the parent component
    this.message = data.message;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    this.clipboard.copy(this.message);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000); // Reset the copied state after 3 seconds
  }
}
