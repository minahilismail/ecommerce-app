import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface NotificationOptions {
  title: string;
  text?: string;
  timer?: number;
  width?: string;
  position?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
  showCancelButton?: boolean;
  html?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private defaultOptions = {
    toast: true,
    position: 'bottom-end' as const,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    backdrop: false,
    width: '350px',
    padding: '1rem',
    animation: false,
  };

  showSuccess(options: NotificationOptions) {
    return Swal.fire({
      ...this.defaultOptions,
      icon: 'success',
      ...options,
    });
  }

  showError(options: NotificationOptions) {
    return Swal.fire({
      ...this.defaultOptions,
      icon: 'error',
      ...options,
    });
  }

  showWarning(options: NotificationOptions) {
    return Swal.fire({
      ...this.defaultOptions,
      icon: 'warning',
      ...options,
    });
  }

  showInfo(options: NotificationOptions) {
    return Swal.fire({
      ...this.defaultOptions,
      icon: 'info',
      ...options,
    });
  }
}
