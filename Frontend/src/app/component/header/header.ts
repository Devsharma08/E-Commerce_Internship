import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories';
import { categoryType } from '../../interface/categoryType';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { Auth } from '../../services/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [MatIconModule,FormsModule,MatIconModule,MatButtonModule,MatMenuModule,RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  categoriesService=inject(CategoriesService)
  customerService = inject(CustomerService)
  authService = inject(Auth)
  categoriesList:categoryType[] = []
  searchVal!:string;
  userNameIs!:string;
  router = inject(Router)
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '221B Baker Street, London'
  };

  cdRef = inject(ChangeDetectorRef);
  ngOnInit(){
    this.customerService.getCategoryListName().subscribe((res:any)=>{
      // console.log(res.allCategoriesList);
      // res.allCategoriesList.map((item:any)=>{
      //   this.categoriesList.push(item);
      //   // console.log(item.name)        
      // })      
        // console.log(res);
        
        this.categoriesList = res.categoryNameList;
        this.cdRef.detectChanges()
        // console.log("cat list:",this.categoriesList);
      })     
  }

  //getName
  get userName(){
    let userData:any;
    userData = localStorage.getItem('userData');
    this.userNameIs = JSON.parse(userData).name;
    return JSON.parse(userData).name;

  }

  isAdmin(){
    return this.authService.isAdmin();
  }

  // logout
  handleLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  handleSearch(e:any){
    this.router.navigate(['/product'], {queryParams: { search: this.searchVal }});

    console.log("Search Value",e);    
  }
}
