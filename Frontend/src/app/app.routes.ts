import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { Categories } from './component/manage/categories/categories';
import { CategoryForm } from './component/manage/category-form/category-form';
import { Brand } from './component/manage/brand/brand';
import { BrandForm } from './component/manage/brand-form/brand-form';
import { Product } from './component/manage/product/product';
import { ProductForm } from './component/manage/product-form/product-form';
import { ProductList } from './component/product-list/product-list';
import { ProductDetail } from './component/product-detail/product-detail';
import { Login } from './component/auth/login/login';
import { Signup } from './component/auth/signup/signup';
import { AuthGuard } from './component/core/authGuard';
import { Dashboard } from './component/dashboard/dashboard';
import { AdminGuard } from './component/core/adminGuard';
import { Profile } from './component/auth/profile/profile';
import { Wishlist } from './component/wishlist/wishlist';
import { Cart } from './component/cart/cart';
import { Order } from './component/order/order';

export const routes: Routes = [
  {path:'',
  component:Home,
  canActivate:[AuthGuard]},
  {path:'user/profile',
  component:Profile,
  canActivate:[AuthGuard]},
  {path:'admin/categories',
  component:Categories,
  canActivate:[AuthGuard]},
  {path:'admin/categories/add',
  component:CategoryForm,
  canActivate:[AuthGuard]},
  {path:'admin/categories/:id',
  component:CategoryForm,
  canActivate:[AuthGuard]},
  {path:'admin/brand',
  component:Brand,
  canActivate:[AuthGuard]},
  {path:'admin/brand/add',
  component:BrandForm,
  canActivate:[AuthGuard]},
  {path:'admin/brand/:id',
  component:BrandForm,
  canActivate:[AuthGuard]},
  {path:'admin/product',
  component:Product,
  canActivate:[AuthGuard]},
  {path:'admin/dashboard',
  component:Dashboard,
  canActivate:[AuthGuard]},
  {path:'admin/product/add',
  component:ProductForm,
  canActivate:[AuthGuard]},
  {path:'admin/product/:id',
  component:ProductForm,
  canActivate:[AuthGuard]},
  {path:'product',
  component:ProductList,
  canActivate:[AuthGuard]},
  {path:'product/:id',
  component:ProductDetail,
  canActivate:[AuthGuard]},
  {path:'login',
  component:Login},
  {path:'register',
  component:Signup},
  {path:'wishlist',
  component:Wishlist},
  {path:'cart',
  component:Cart},
  {path:'order',
  component:Order}
  ];
