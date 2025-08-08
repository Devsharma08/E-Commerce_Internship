import { ChangeDetectorRef, Component } from '@angular/core';
import { WishlistService } from '../../services/wishlist/wishlist-service';
import { ProductUserData } from '../../interface/productType';
import { inject } from '@angular/core';
import { Card } from '../card/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wishlist',
  imports: [Card,CommonModule,FormsModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist {
  private wishlistService = inject(WishlistService);
  wishlistItems:any = [];
  itemsCount:number = 0;
  
  cdRef = inject(ChangeDetectorRef)

  currentUserID:string = ''

  ngOnInit(): void {
    const storageData = localStorage.getItem('userData');
    const localUser = storageData ? JSON.parse(storageData) : null;
    const userId = localUser?.id;
    this.currentUserID = userId
    this.getAllWishListIten();

    // if (userId) {
    //   this.wishlistService.getAllWishList(userId).subscribe((res: any) => {
    //     // Each res[i] contains: { productId: {...product} }
    //     // this.wishlistItems = res.map((item: any) => item.productId);
    //     console.log("Wishlist data",res);
    //     this.wishlistItems = res
    //     this.itemsCount = res.length;
    //     this.cdRef.detectChanges()
    //   });
    // }

    this.cdRef.detectChanges()
  }

    refreshWishlist(){
      this.getAllWishListIten()
    }

  getAllWishListIten(){
    this.wishlistService.getAllWishList(this.currentUserID).subscribe((res: any) => {
        // this.wishlistItems = res.map((item: any) => item.productId);
        console.log("Wishlist data",res);
        this.wishlistItems = res
        console.log("in wishlist page, all items",this.wishlistItems);
        
        this.itemsCount = res.length;
        this.cdRef.detectChanges()


      });
  }
}
