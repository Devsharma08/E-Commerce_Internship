import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  http = inject (HttpClient);

  constructor(){}

  apiBaseUrl = environment.apiBaseUrl

  getAllbrand(){
    return this.http.get(`${this.apiBaseUrl}/brand/`);
  }
  
  deleteBrand(id:String){
    return this.http.delete(`${this.apiBaseUrl}/brand/${id}`)
  }
  

  getSingleBrand(id:String){
    return this.http.get(`${this.apiBaseUrl}/brand/${id}`)
  }


  updateBrand(id:String,name:String){
    return this.http.patch(`${this.apiBaseUrl}/brand/${id}`,{
      "name":name,
    })
  }

  addBrand(name:String){
    return this.http.post(`${this.apiBaseUrl}/brand`,{
      "name":name,
    })
  }
}
