import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ProductUserData } from '../../interface/productType';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist/wishlist-service';
import { Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';

@Component({
  standalone:true,
  selector: 'app-card',
  imports: [MatCardModule,CommonModule,MatIconModule,MatButtonModule,RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
  @Input() product!: ProductUserData;
  
  @Output() wishlistChanged = new EventEmitter<void>();
  @Output() cartChanged = new EventEmitter<void>();


  wishListService = inject(WishlistService);
  cartService = inject(CartService);
  router = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef)
  cartQuantity:number = 1;

  userData = localStorage.getItem('userData');
  userId = this.userData ? JSON.parse(this.userData).id : null;

  CurrentUserId:string = '' 



  wishListArray:any = [];
  cartListArray:any = [];

  getAllWishList(userId:string){
    this.wishListService.getAllWishList(userId).subscribe((res) => {
    this.wishListArray = res;
    this.cdRef.detectChanges();
    // console.log("all wished items:",this.wishListArray);
  });
  }

ngOnInit(): void {
  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData).id : null;

  if (!userId) return;

  this.CurrentUserId = userId;

 
  this.cartService.cartItems$.subscribe((items) => {
    this.cartListArray = items;
    // console.log("Cart items (from observable):", this.cartListArray);
    this.cdRef.detectChanges(); 
  });

  this.getAllWishList(userId);
}



isCartExist(productId: string | undefined): boolean {
  if (!productId || !Array.isArray(this.cartListArray)) return false;

  return this.cartListArray.some((item: any) =>
    item.productId === productId || item.productId?._id === productId
  );
}


addToCart(product: any): void {
  if (!product?._id || !this.CurrentUserId) return;

  if (this.isCartExist(product._id)) {
    this.cartService.deleteFromCart(product._id, this.CurrentUserId).subscribe(() => {
      alert('Deleted successfully');
      this.cartService.loadCartOnStart(); // ✅ trigger refresh
      this.cartChanged.emit();
    });
  } else {
    const confirmAdd = confirm("Are you sure you want to add this product to cart?");
    if (confirmAdd) {
      this.cartService.addToCart({
        userId: this.CurrentUserId,
        productId: product._id,
        quantity: this.cartQuantity
      }).subscribe((res) => {
        console.log("Added to cart successfully:", res);
        this.cartService.loadCartOnStart(); // ✅ trigger refresh
        this.cartChanged.emit();
      });
    }
  }
}

isExists(productId: string | undefined): boolean {
  if (!productId) return false;

  return this.wishListArray.some((item: any) =>
    item.productId === productId || item.productId?._id === productId
  );
}



addWishList(product: ProductUserData, event: Event): void {
  event.stopPropagation();

  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData)?.id : null;

  if (!userId || !product._id) return;

  if (this.isExists(product._id)) {
    if (confirm('Are you sure you want to remove this item from wishlist?')) {
      this.wishListService.deleteWishListProduct(product._id, userId).subscribe(() => {
        this.wishListArray = this.wishListArray.filter(
          (item: any) =>
            item.productId !== product._id && item.productId?._id !== product._id
        );
        this.wishlistChanged.emit();
        this.cdRef.detectChanges();
      });
    }
  } else {
    this.wishListService.addToWishList(product._id, userId).subscribe((res: any) => {
      this.wishListArray.push(res.item);
      this.wishlistChanged.emit();
      this.cdRef.detectChanges();
    });
  }
}

}
