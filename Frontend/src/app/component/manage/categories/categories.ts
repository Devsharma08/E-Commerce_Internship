import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CategoriesService } from '../../../services/categories';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule } from '@angular/router';


export interface UserData {
  id: string;
  name: string;
  action: string;
}


@Component({
  selector: 'app-categories',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatButtonModule,RouterModule,RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories{

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<UserData>;

  // id!:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }

  getAllCategories(){
    return this.categoriesService.getAllCategories().subscribe((result:any)=>{
      this.dataSource.data = result.allCategoriesList
    })
  }

  ngOnInit(){
    this.getAllCategories();
  }

  categoriesService = inject(CategoriesService)

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleDelete(id:String){
    let isConfirm = confirm('Are You sure Wan\'t to Delete')
    if(isConfirm){
    this.categoriesService.deleteCategory(id).subscribe((res)=>{
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


