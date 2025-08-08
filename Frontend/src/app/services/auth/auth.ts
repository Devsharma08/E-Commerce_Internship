import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  http = inject(HttpClient)
  apiUrl = environment.apiBaseUrl

  isLoggedIn(){
    let token = localStorage.getItem('token');
    return !!token;
  }
  
  userLogin(userInfo:any){
    return this.http.post(`http://localhost:5000/api/auth/login`,userInfo);
  }
  
  userRegister(userInfo:any){
    return this.http.post(`http://localhost:5000/api/auth/register`,userInfo)
  }

  getAllOrders(){
    return this.http.get(`http://localhost:5000/api/admin/order/`)
  }

  updateUserStataus(orderId:string, status:string){
    return this.http.post(`http://localhost:5000/api/admin/order/${orderId}`,{status:status})
  }
  
isAdmin(): boolean {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    const { isAdmin } = parsedData;
    return !!isAdmin;
  }
  return false;
}


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
}
