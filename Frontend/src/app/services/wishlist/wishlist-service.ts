import { Injectable, inject } from '@angular/core'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(){
    const userData = localStorage.getItem('userData');
    const currentLogedUser = JSON.parse(userData!)
    this.getAllWishList(currentLogedUser.id);
  }

  getAllWishList(userId: string) {
    const params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.apiBaseUrl}/wishlist`, { params });
  }

  deleteWishListProduct(productId: string, userId: string) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('productId', productId);

    return this.http.delete(`${this.apiBaseUrl}/wishlist`, { params });
  }

  addToWishList(productId: string, userId: string) {
    return this.http.post(`${this.apiBaseUrl}/wishlist/${productId}`, { userId });
  }
}
