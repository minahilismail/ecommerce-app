import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  constructor(private userService: UserService, private dialog: MatDialog) {}

  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  openUserDialog(user?: User): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.backdropClass = 'sidebar-dialog-backdrop';

    dialogConfig.width = '400px';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '400px';
    dialogConfig.maxHeight = '100vh';

    dialogConfig.position = {
      top: '0px',
      right: '0px',
    };

    dialogConfig.panelClass = 'sidebar-dialog-panel';

    dialogConfig.data = user || null;

    const dialogRef = this.dialog.open(UpdateUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        this.loadUsers();
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
