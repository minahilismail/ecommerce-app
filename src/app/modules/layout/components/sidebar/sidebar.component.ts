import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Output() viewChanged = new EventEmitter<string>(); // Add this

  isExpanded = true;
  isProductsMenuOpen = false;
  isCategoriesMenuOpen = false;

  private modalService = inject(NgbModal);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggled.emit(this.isExpanded);

    if (!this.isExpanded) {
      this.isProductsMenuOpen = false;
      this.isCategoriesMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
