import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { ProductUserData } from '../../interface/productType';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../card/card';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../services/brand/brand';
import { ProductService } from '../../services/product/product-service';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Card,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);

  private productService = inject(ProductService);
  private brandService = inject(BrandService);

  // Query params
  categoryId: string = '';
  brandId: string = '';
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;
  sortBy: string = 'price';
  sortOrder: string = 'asc';
  isNext:Boolean = true

  productList: ProductUserData[] = [];
  productNameList: any[] = [];
  brandNameList: any[] = [];

  ngOnInit(): void {
    this.getAllBrandName();
    this.getAllProductName();

    this.route.queryParams.subscribe((params) => {
      this.limit = +params['limit'] || 10;
      this.searchTerm = params['search'] || '';
      this.sortBy = params['sortBy'] || 'price';
      this.sortOrder = params['sortOrder'] || 'asc';
      this.categoryId = params['categoryId'] || '';
      this.brandId = params['brandId'] || '';
      this.getSearchProductList();
    });
  }

  handleSortByChange(e:any){
    // console.log("value:",e);    
    this.sortBy = e;
    this.getSearchProductList();
  }

  handleSortOrderChange(e:any){
    // console.log("value:",e);   
    this.sortOrder = e; 
    this.getSearchProductList();

  }

  getAllBrandName(): void {
    this.brandService.getAllbrand().subscribe((res: any) => {
      this.brandNameList = res.allBrandList;
      this.cdRef.detectChanges();
    });
  }

  getAllProductName(): void {
    this.productService.getAllProduct().subscribe((res: any) => {
      this.productNameList = res.allProductList;
      this.cdRef.detectChanges();
    });
  }

handlePrevPageChange() {
  if (this.page > 1) {
    this.page--;
    this.getSearchProductList();
  }
}

handleNextPageChange() {
  if (this.isNext) {
    this.page++;
    this.getSearchProductList();
  }
}

handleBrandChange(e: string) {
  this.brandId = e;
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      brandId: this.brandId,
    },
    queryParamsHandling: 'merge',
  });
  setTimeout(()=>{
    this.getSearchProductList();
    this.cdRef.detectChanges();
  },300)
    
}


  totalCount: number = 0;

getSearchProductList(): void {
  this.customerService
    .getAllProductDetail(
      this.categoryId,
      this.brandId,
      this.searchTerm,
      this.page,
      this.limit,
      this.sortBy,
      this.sortOrder
    )
    .subscribe({
      next: (res: any) => {
        this.productList = res.products || [];
        this.totalCount = res.totalCount || 0;

        // Calculate if next page exists
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.isNext = this.page < totalPages;

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch product list:', err);
      },
    });
}

}
