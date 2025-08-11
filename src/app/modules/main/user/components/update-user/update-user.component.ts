import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Role, User } from '../../model/user';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;

  user: User;
  availableRoles: Role[] = [];
  selectedRoles: Role[] = [];
  selectedRoleId: string = '';
  formSubmitted: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = data ? { ...data } : this.getEmptyUser();
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles: any) => {
        this.availableRoles = roles;
        this.initializeSelectedRoles();
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
      },
    });
  }

  initializeSelectedRoles() {
    if (this.user?.roles && this.availableRoles.length > 0) {
      this.selectedRoles = this.availableRoles.filter((role) =>
        this.user.roles?.includes(role.name)
      );
    }
  }

  addRole() {
    if (this.selectedRoleId) {
      const role = this.availableRoles.find(
        (r) => r.id === +this.selectedRoleId
      );
      if (role && !this.isRoleSelected(role.id)) {
        this.selectedRoles.push(role);
        this.selectedRoleId = '';
      }
    }
  }

  removeRole(roleId: number) {
    // Preventing removing the last role
    if (this.selectedRoles.length > 1) {
      this.selectedRoles = this.selectedRoles.filter(
        (role) => role.id !== roleId
      );
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoles.some((role) => role.id === roleId);
  }

  isFormValid(): boolean | null {
    return this.userForm?.valid && this.selectedRoles?.length > 0;
  }

  onSubmit() {
    this.formSubmitted = true;

    // Check form validity and role selection
    if (!this.isFormValid()) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.controls[key].markAsTouched();
      });

      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix all validation errors before submitting.',
      });
      return;
    }

    this.isSubmitting = true;

    // Prepare user data
    const userData = {
      ...this.user,
      roleIds: this.selectedRoles.map((role) => role.id),
    };

    this.userService.updateUser(userData.id!, userData).subscribe({
      next: () => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        const customError =
          error?.error?.CustomError && Array.isArray(error.error.CustomError)
            ? error.error.CustomError[0]
            : null;

        if (
          customError &&
          customError.includes(
            'User with the same email or username already exists!'
          )
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: customError,
          });
        } else if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please check the form for errors.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the user.',
          });
          console.error('Error updating user:', error);
        }
      },
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  getEmptyUser(): User {
    return {
      id: 0,
      name: '',
      username: '',
      email: '',
      password: '',
      isActive: true,
      roles: [],
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
