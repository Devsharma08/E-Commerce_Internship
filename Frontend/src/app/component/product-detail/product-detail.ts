import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product-service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Card } from '../card/card';
import { WishlistService } from '../../services/wishlist/wishlist-service';
import { ProductUserData } from '../../interface/productType';

  import { CartService } from '../../services/cart/cart-service'; 
import { CartItem } from '../../interface/cartType';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule,FormsModule ,MatButtonModule,Card, MatCardModule, MatIconModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {

  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  customerService = inject(CustomerService);
  cdRef = inject(ChangeDetectorRef)
  currentImage:string = ''
  categoryId:string = ''
  productId: string = '';
  productList: any;
  reviews: any[] = [];
  productImagesList :string[] = [] 
  similarProducts = []
  
  wishListService = inject(WishlistService);
  router = inject(ActivatedRoute);
  cartService = inject(CartService);
  
    wishListArray:any = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.getProductDetail();
       this.cdRef.detectChanges()
    });

    const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData)?.id : null;

  if (!userId) return;

  this.wishListService.getAllWishList(userId).subscribe((res) => {
    this.wishListArray = res;
    this.cartService.cartItems$.subscribe(items => {
    this.cartItems = items;
  });
    this.cdRef.detectChanges();
  });
    // if(this.categoryId)
  }


cartItems: CartItem[] = [];


isInCart(productId: any): boolean {
  return this.cartItems.some((item:any) => item.productId._id === productId);
  // return this.cartItems.some(item => console.log(item)
}


toggleCart(product: any): void {
  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData).id : null;
  if (!userId || !product?._id) return;

  const quantity = 1; 

  if (this.isInCart(product._id)) {
    this.cartService.deleteFromCart(product._id, userId).subscribe(() => {
      this.cartService.loadCartOnStart();
    });
  } else {
    this.cartService.addToCart({ productId: product._id, userId, quantity }).subscribe(() => {
      this.cartService.loadCartOnStart();
    });
  }
}



handleImageClick(event: Event): void {
  const target = event.target as HTMLImageElement;
  const src = target?.currentSrc;
  let firstImg = this.productImagesList[0]
  
  this.currentImage = src ? src : firstImg;
}
getProductDetail(): void {
  this.productService.getSingleProduct(this.productId).subscribe((res: any) => {
    this.productList = res.user;
    this.productImagesList = res.user.images?.slice(0, 6);
    this.categoryId = res.user.categoryId;

    if (this.productImagesList.length > 0) {
      this.currentImage = this.productImagesList[0];
    }
    this.getProductOfSameCategory();

    this.cdRef.detectChanges();
  });
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
        this.cdRef.detectChanges();
      });
    }
  } else {
    this.wishListService.addToWishList(product._id, userId).subscribe((res: any) => {
      this.wishListArray.push(res.item);
      this.cdRef.detectChanges();
    });
  }
}


getProductOfSameCategory(): void {
  if (!this.categoryId || !this.productId) return;

  this.customerService.getProductOfSameCategory(this.categoryId, this.productId)
    .subscribe((res:any) => {
      // console.log("Related products:", res);
      this.similarProducts = res
      // console.log(this.similarProducts);
      
    });
}


  addToCart(productId: string): void {
    console.log('Added to cart:', productId);
  }

}
