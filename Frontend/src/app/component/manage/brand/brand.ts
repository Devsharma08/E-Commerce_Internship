import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrandService } from '../../../services/brand/brand';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule } from '@angular/router';



export interface UserData {
  id: string;
  name: string;
  action: string;
}


@Component({
  selector: 'app-brand',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButtonModule,RouterModule,RouterLink],
  templateUrl: './brand.html',
  styleUrl: './brand.scss'
})



export class Brand {

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<UserData>;

  // id!:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }
  BrandService = inject(BrandService)

  getAllCategories(){
    this.BrandService.getAllbrand().subscribe((result:any)=>{
      // console.log(result);
      
      this.dataSource.data = result.allBrandList
    })
  }

  ngOnInit(){
    this.getAllCategories();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleDelete(id:String){
    let isConfirm = confirm('Are You sure Wan\'t to Delete')
    if(isConfirm){
    this.BrandService.deleteBrand(id).subscribe((res)=>{
      alert('deleted sussfully');
      this.getAllCategories();
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