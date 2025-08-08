import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ProductService } from '../../../services/product/product-service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule } from '@angular/router';
import { ProductUserData } from '../../../interface/productType';

@Component({
  selector: 'app-product',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButtonModule,RouterModule,RouterLink],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {

  displayedColumns: string[] = ["name","shortDescription","price","discount","action"];
  dataSource: MatTableDataSource<ProductUserData>;

  // id!:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }
  ProductService = inject(ProductService)

  getAllProduct(){
    this.ProductService.getAllProduct().subscribe((result:any)=>{
      console.log(result);
      
      this.dataSource.data = result.allProductList
    })
  }

  ngOnInit(){
    this.getAllProduct();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleDelete(id:String){
    let isConfirm = confirm('Are You sure Wan\'t to Delete')
    if(isConfirm){
    this.ProductService.deleteProduct(id).subscribe((res)=>{
      alert('deleted sussfully');
      this.getAllProduct();
    })}
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

