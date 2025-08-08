import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { Auth } from "../../services/auth/auth";

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if(authService.isAdmin()){
      return true;
    } else{
      return router.parseUrl('/');
    }
  } else {
    return router.parseUrl('/login');
  }
};
