import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { HttpClient } from '@angular/common/http';
import { ProductUserData } from '../../interface/productType';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject (HttpClient);

  apiBaseUrl = environment.apiBaseUrl

  constructor(){}

  getAllProduct(){
    return this.http.get<ProductUserData[]>(`${this.apiBaseUrl}/product/`);
  }
  
  deleteProduct(id:String){
    return this.http.delete(`${this.apiBaseUrl}/product/${id}`)
  }
  

  getSingleProduct(id:String){
    return this.http.get<ProductUserData>(`${this.apiBaseUrl}/product/${id}`)
  }


  updateProduct(id:String,productObject:any){
    return this.http.patch(`${this.apiBaseUrl}/product/${id}`,productObject)
  }

  addProduct(productObject:any){
    return this.http.post(`${this.apiBaseUrl}/product`,productObject)
  }
  
}
