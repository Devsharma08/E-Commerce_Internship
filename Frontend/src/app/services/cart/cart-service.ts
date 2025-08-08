import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CartItem } from '../../interface/cartType';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiBaseUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartOnStart();
  }

 
  loadCartOnStart(): void {
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const userId = userData?.id;

    if (userId) {
      this.getAllCartItem(userId).subscribe({
        next: (res:any) => {
          this.cartItemsSubject.next(res);
          
          // console.log('Cart items loaded:', res);
        },
        error: (err) => {
          console.error('Failed to load cart items:', err);
        },
      });
    }
  }

 
  getAllCartItem(userId: string): Observable<{ allCarts: CartItem[] }> {
    return this.http.get<{ allCarts: CartItem[] }>(`${this.apiBaseUrl}/cart/${userId}`);
  }

  
  addToCart(payload: {
    productId: string;
    userId: string;
    quantity: number;
  }): Observable<any> {
    const { productId, userId, quantity } = payload;
    return this.http.post(`${this.apiBaseUrl}/cart/${productId}/${quantity}`, { userId });
  }

  
  deleteFromCart(productId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/cart/${productId}/${userId}`);
  }

  
  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/cart/${userId}`);
  }


  get cartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
}
