import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component,inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderType } from '../../interface/orderTypes';
import { orderService } from '../../services/order/order';
// import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-order',
  standalone:true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order{

   userOrders: any = [] ;
   localData:any;
   userId:string = ''

   orderService = inject(orderService)
   cdRef = inject(ChangeDetectorRef);

  constructor(){
    const userData = localStorage.getItem('userData');
    this.localData = JSON.parse(userData!);
    // this.cdRef.detectChanges();
    this.userId = this.localData.id
    // console.log("orders:",this.localData.id);
  }

  ngOnInit(){
    this.getAllOrders();
  }
  getTotal(order: any): number {
  if (!order?.items) return 0;

  return order.items.reduce((acc: number, item: any) => {
    const price = Number(item.productId.price);
    const qty = Number(item.quantity);
    return acc + (isNaN(price) || isNaN(qty) ? 0 : price * qty);

  }, 0);
}



  
  getAllOrders(){
    this.orderService.gertllOrders(this.userId).subscribe((res:any)=>{
      // console.log("all booked orders:",res);
      this.userOrders = res.customerOrder;
    this.cdRef.detectChanges();

    })
  }

}
