import { CartItem } from "./cartType";

export interface OrderType{
  Date:Date,
  items:CartItem[],
  paymentType:string,
  totalAmount:number,
  address:any,
  status?:number
}