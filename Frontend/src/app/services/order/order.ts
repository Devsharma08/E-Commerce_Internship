import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class orderService {

  http = inject(HttpClient)
  apiBaseUrl = environment.apiBaseUrl;

  gertllOrders(userId:string){
    const params = new HttpParams().set('userId',userId);
    return this.http.get(`${this.apiBaseUrl}/order`,{params});
  }

  createlOrders(orderData:any){
    return this.http.post(`${this.apiBaseUrl}/order`,orderData);
  }

  deleteOrders(productId:string,userId:string){
    const params = new HttpParams().set('userId',userId).set('productId',productId);
    return this.http.delete(`${this.apiBaseUrl}/order`,{params});
  }
  
}
