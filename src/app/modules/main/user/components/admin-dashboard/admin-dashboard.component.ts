import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  sidebarExpanded = true;
  currentView = 'dashboard';

  currentRoute: string = '';

  constructor() {
    console.log('AdminDashboardComponent constructor called');
  }
  ngOnInit(): void {}

  onSidebarToggled(isExpanded: boolean) {
    this.sidebarExpanded = isExpanded;
  }

  // Method to handle view changes from sidebar
  onViewChanged(view: string) {
    this.currentView = view;
  }
}
