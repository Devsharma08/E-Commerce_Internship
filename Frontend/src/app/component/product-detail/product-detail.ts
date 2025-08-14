import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product-service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroupName, FormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Card } from '../card/card';
import { WishlistService } from '../../services/wishlist/wishlist-service';
import { ProductUserData } from '../../interface/productType';
import { FormGroup,ReactiveFormsModule } from '@angular/forms';

  import { CartService } from '../../services/cart/cart-service'; 
import { CartItem } from '../../interface/cartType';
import { BrowserModule } from '@angular/platform-browser';
import { Comment } from '../../services/comment/comment';

@Component({
  selector: 'app-product-detail',
  standalone:true,
  imports: [CommonModule,FormsModule ,MatButtonModule,Card,ReactiveFormsModule, MatCardModule, MatIconModule],
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
  productId: string = ''
  productList: any;
  reviews: any[] = [];
  allComments:any = []
  productImagesList :string[] = [] 
  similarProducts = []
  userComment:string = ''
  userRating:number = 0
  commentUserId:string = ''
  commentProductId:string = ''
  commentUserName:string = ''
  deleteBtn:number|undefined = undefined; 
  
  wishListService = inject(WishlistService);
  router = inject(ActivatedRoute);
  cartService = inject(CartService);
  commentService = inject(Comment);
  
  wishListArray:any = [];

  commentForm = new FormGroup({
    text:new FormControl('',{validators:[Validators.required,Validators.maxLength(50)]}),
    rating:new FormControl(0,{validators:[Validators.required,Validators.max(5)]})
  })
  ngOnInit(): void {    
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.commentProductId = this.productId
      this.getProductDetail();
      this.getAllComment(this.commentProductId);
       this.cdRef.detectChanges()
    });

    const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData)?.id : null;
  this.commentUserId = userData ? JSON.parse(userData)?.id : null;
  this.commentUserName = userData ? JSON.parse(userData)?.name : null;

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

handleMouseOver(e:any){
  this.deleteBtn = e;
  this.cdRef.detectChanges()
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
    // console.log('Added to cart:', productId);
  }

  getAllComment(commentProductId:any){
    this.commentService.getAllComment(commentProductId).subscribe((res)=>{
      // console.log("all comments",res);
      this.allComments = res; 
      // console.log("all comments after save",this.allComments);
      this.cdRef.detectChanges();
    })
  }

  deleteComment(id:string){
    this.commentService.deleteCommennt(id,this.commentUserId).subscribe((res)=>{
      alert('deleted successfully');
      this.getAllComment(this.commentProductId);
    })
  }

  handleCommentSubmit(){
    // console.log(this.commentForm.value);
  let commentData = {
    userId: String(this.commentUserId).trim(),
    productId: String(this.commentProductId).trim(),
    userName: this.commentUserName,
    text: this.commentForm.value.text,
    rating: Number(this.commentForm.value.rating)
  };
    this.commentService.createComment(commentData).subscribe(()=>{
      alert('comment added successfully')
      this.getAllComment(this.commentProductId);
      this.cdRef.detectChanges();
    })
  }
}
