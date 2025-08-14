import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Comment {
  apiUrl = environment.apiBaseUrl;

  http = inject(HttpClient)

  createComment(data:any){
    return this.http.post(`${this.apiUrl}/comment`,data);
  }

  getAllComment(productId:string){
    return this.http.get(`${this.apiUrl}/comment/${productId}`);
  }
  
  deleteCommennt(id:string,userId:string){
    return this.http.delete(`${this.apiUrl}/comment/${id}/${userId}`);
  }
}
