import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { categoryType } from '../interface/categoryType';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  http = inject (HttpClient);

  constructor(){}

  apiBaseUrl = environment.apiBaseUrl

  getAllCategories(){
    return this.http.get(`${this.apiBaseUrl}/categories`);
  }
  
  deleteCategory(id:String){
    return this.http.delete(`${this.apiBaseUrl}/categories/${id}`)
  }
  

  getSingleCategory(id:String){
    return this.http.get<categoryType>(`${this.apiBaseUrl}/categories/${id}`)
  }


  updateCategory(id:String,name:String){
    return this.http.patch<categoryType>(`${this.apiBaseUrl}/categories/${id}`,{
      "name":name,
    })
  }

  addCategory(name:String){
    return this.http.post<categoryType>(`${this.apiBaseUrl}/categories`,{
      "name":name,
    })
  }
}
