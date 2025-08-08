import { Component,Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card'
import {MatButtonModule} from '@angular/material/button'
import { inject } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { ProductUserData } from '../../interface/productType';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Card } from '../card/card';
import { Embla } from '../embla/embla';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';


@Component({
  selector: 'app-home',
  imports: [MatCardModule,RouterLink, MatButtonModule,FormsModule,CommonModule,Card,Embla],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home {
  //  @Input() productList!: {
  //   name: string;
  //   shortDescription: string;
  //   price: number;
  //   discount: number;
  //   images: string[];
  //   categoryId?: string;
  //   brandId?: string;
  // };

  newProductList:ProductUserData[] = []
  featuredProductList:ProductUserData[] = []

  productImage :String[] = []
  

  customerService = inject(CustomerService)
  cartService = inject(CartService)
  cdRef = inject(ChangeDetectorRef)
  getNewProduct(){
    this.customerService.getNewProduct().subscribe((res:any)=>{   
      this.newProductList = res.newProduct ?? [];
      // console.log("this.newProductList",this.newProductList)
      //  this.productImage = res.newProduct.images[0] ?? [];
      this.productImage.push(...res.newProduct);
      this.cdRef.detectChanges(); 
      
      // console.log(this.productList);
      // this.newproductList.map((item)=>{
        // console.log(item.name,item.price,item.shortDescription,item.discount);
      // })
      
    })
  }

  handleCartChange(){
    this.cartService.loadCartOnStart();
  }

  getFeaturedProduct(){
    this.customerService.getFeaturedProduct().subscribe((res:any)=>{  
      // console.log(res);      
      // console.log("inside featured product");
      
      this.featuredProductList = res.featuredProduct ?? [];
      // console.log("this.featuredProductList",this.featuredProductList);
      this.productImage.push(...res.featuredProduct);
      // console.log(":images: ",this.productImage);
      
      this.cdRef.detectChanges(); 
      // console.log(this.productList);
      // this.featuredproductList.map((item)=>{
        // console.log(item.name,item.price,item.shortDescription,item.discount);
      // })
      
    })
  }


  ngOnInit(){
    this.getFeaturedProduct();
    this.getNewProduct();
  }
}
