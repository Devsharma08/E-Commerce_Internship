import { ChangeDetectorRef, Component,inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart-service';
import { CartTypes } from '../../interface/cartTypes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { categoryType } from '../../interface/categoryType';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio'
import { orderService } from '../../services/order/order';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { loadStripe, Stripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-cart',
  imports:  [CommonModule,FormsModule,MatRadioModule,MatInputModule,MatLabel,MatFormFieldModule,MatIconModule,ReactiveFormsModule,FormsModule, MatButtonModule, MatCardModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart{

  cdRef = inject(ChangeDetectorRef)
  formbuilder = inject(FormBuilder)
  orderService = inject(orderService);
  router = inject(Router);
  http = inject(HttpClient)

  checkOutForm!:FormGroup;
  paymentForm!:FormGroup;

  stripePromise = loadStripe(environment.stripePublicKey); 

  cartItems: any;
  userId: string = '';
  paymentStep:number = 0

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    this.userId = userData ? JSON.parse(userData)?.id : '';
    
  this.checkOutForm = this.formbuilder.group({
    address:['',Validators.required],
    pincode:[0,Validators.required],
    city:['',Validators.required],
  });


  this.paymentForm = this.formbuilder.group({
    paymentMode:['',Validators.required]
  });
    
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cdRef.detectChanges()
      // console.log("cart page :",items);
    });

    this.cartService.loadCartOnStart();

  }

  handleShoppingForm(){
    this.paymentStep = 2;
    // console.log("form data:",this.checkOutForm.value);    
  }


 handlePaymentType(){
  // console.log("payment mode:",this.paymentForm.value);
  }
  

  ToStepOne(){
    this.paymentStep = 1;
  }

  getBack(){
    if(this.paymentStep>1){
      this.paymentStep = this.paymentStep - 1;
      this.cdRef.detectChanges()
    }
  }



  // async checkout() {
  //   this.http.post<{ id: string }>('http://localhost:5000/create-checkout-session', {})
  //     .subscribe(async (session) => {
  //       const stripe: Stripe | any = await this.stripePromise; 
  //       if (!stripe) {
  //         console.error('Stripe failed to initialize');
  //         return;
  //       }

  //       const { error } = await stripe.redirectToCheckout({
  //         sessionId: session.id
  //       });

  //       if (error) {
  //         console.error('Stripe Checkout error:', error.message);
  //       }
  //     });

  // }

  increaseQuantity(item: CartTypes) {
    const updatedQuantity = item.quantity + 1;

    this.cartService.addToCart({
      productId: item.productId._id,
      userId: this.userId,
      quantity: updatedQuantity,
    }).subscribe(() => {
      this.cartService.loadCartOnStart();
      this.cdRef.detectChanges()
    });
  }

  async finalCheckout() {
  // console.log("click final checkout");

  const order = {
    items: this.cartItems.map((item: any) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price // in case your backend needs it
    })),
    paymentMode: this.paymentForm.value.paymentMode,
    quantity: this.cartItems.reduce((total: number, item: any) => total + item.quantity, 0),
    address: this.checkOutForm.value.address,
    pincode: this.checkOutForm.value.pincode,
    city: this.checkOutForm.value.city,
    totalAmount: this.getTotal(),
    date: new Date(),
    userId: this.userId
  };

  if (this.paymentForm.value.paymentMode === 'online') {

    this.http.post<{ id: string }>(
  'http://localhost:5000/create-checkout-session',
  order
).subscribe({
  next: async (session) => {
    const stripe: Stripe | null = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe failed to initialize');
      return;
    }

    await stripe.redirectToCheckout({ sessionId: session.id });
  },
  error: (err) => {
    console.error('Error creating checkout session:', err);
  }
});


  } else {
    // Offline payment - place order directly
    this.orderService.createlOrders(order).subscribe((res: any) => {
      this.cartService.clearCart(res.userId).subscribe(() => {
        // console.log("cart cleared successfully");
        this.cartService.loadCartOnStart();
        this.paymentStep = 0;
        alert(`Your order has been placed successfully!`);
        this.router.navigateByUrl('/cart');
        this.cdRef.detectChanges();
      });
      // console.log("order pushed", res);
    });
  }
}


  // finalCheckout(){
  //   console.log("click final checkout");    
  //   const order = {
  //   items: this.cartItems.map((item:any) => ({
  //     productId: item.productId._id,
  //     quantity: item.quantity
  //   })),
  //   paymentMode: this.paymentForm.value.paymentMode, 
  //   quantity: this.cartItems.reduce((total:number, item:any) => total + item.quantity, 0), 
  //   address: this.checkOutForm.value.address,
  //   date: new Date(),
  //   userId: this.userId
  // };
  //   console.log("order data op ",order);
  //   this.orderService.createlOrders(order).subscribe((res:any)=>{
  //     this.cartService.clearCart(res.userId).subscribe((resCart)=>{
  //       // console.log("cart cleared sussfully");
  //       this.cartService.loadCartOnStart();
  //       this.paymentStep = 0;
  //       alert(`order of are successfully ordered`);
  //       this.router.navigateByUrl('/cart');
  //       this.cdRef.detectChanges();
  //     })
  //     // console.log("order pushed",res);
  //   })   
  // }

decreaseQuantity(item: CartTypes) {
  if (item.quantity === 1) {
    return this.removeItem(item.productId._id);
  }
  const updatedQuantity = item.quantity - 1;

  this.cartService.addToCart({
    productId: item.productId._id,
    userId: this.userId,
    quantity: updatedQuantity,
  }).subscribe(() => {
    this.cartService.loadCartOnStart(); 
    this.cdRef.detectChanges();      
  });
}

getTotal(): number {
  return this.cartItems.reduce(
    (sum: number, item: any) => sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );
}


  removeItem(productId: string): void {
    if (!this.userId) return;
    this.cartService.deleteFromCart(productId, this.userId).subscribe(() => {
      this.cartService.loadCartOnStart();
      this.cdRef.detectChanges();
    });
  }

}

