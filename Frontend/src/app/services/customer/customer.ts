import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { ProductUserData } from '../../interface/productType';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  apiBaseUrl = environment.apiBaseUrl
  http = inject(HttpClient);

  getNewProduct(){
    return this.http.get<ProductUserData[]>(this.apiBaseUrl+'/customer/new');
  }

  getFeaturedProduct(){
    return this.http.get<ProductUserData[]>(this.apiBaseUrl+'/customer/featured');
  }

  getProductOfSameCategory(categoryId:string,productId:any){
    let params = new HttpParams().set('excludeId',productId)
    return this.http.get(`${this.apiBaseUrl}/customer/related/${categoryId}`,{params});
  }

  getCategoryListName(){
    return this.http.get(`${this.apiBaseUrl}/customer`);
  }

  getAllProductDetail(categoryId: string,brandId:string, searchTerm: string, page: number, limit: number, sortBy: string, sortOrder: string) {
  return this.http.get(`${this.apiBaseUrl}/customer/product?categoryId=${categoryId}&brandId=${brandId}&searchTerm=${searchTerm}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
}



}
