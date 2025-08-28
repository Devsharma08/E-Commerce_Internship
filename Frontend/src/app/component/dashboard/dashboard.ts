import { Component, ViewChild, ChangeDetectorRef, AfterViewInit, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../services/auth/auth';
import { CustomerService } from '../../services/customer/customer';
import { CategoriesService } from '../../services/categories';     
import { categoryType } from '../../interface/categoryType';       

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {

  orders: any = [];
  paginatedOrders: any[] = [];

  pageSize = 10;
  pageIndex = 0;

  isAdmin: boolean = false;

  authService = inject(Auth);
  cdRef = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.getAllOrders();
    }
  }
  getAllOrders() {
    this.authService.getAllOrders().subscribe((res) => {
      // console.log("All orders: ", res);
      this.orders = res;
      this.updatePaginatedOrders(); 
      this.cdRef.detectChanges();
    });
  }

  updatePaginatedOrders() {
    if (!this.orders || this.orders.length === 0) {
      this.paginatedOrders = [];
      return;
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedOrders();
  }

  updateStatus(orderId: any, event: any) {
    this.authService.updateUserStataus(orderId, event).subscribe((res:any) => {
      // console.log('Order status updated:', res);
      this.cdRef.detectChanges();
    });
  }
}
