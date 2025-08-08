import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { Auth } from '../../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatInputModule,MatCard,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;
  authService = inject(Auth)

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  router = inject(Router)

  onSubmit() {
    if (this.loginForm.valid) {
      // this.loginForm;
      console.log('User Registered:', this.loginForm.value);
      this.authService.userLogin(this.loginForm.value).subscribe((res:any)=>{
        console.log(res);
        localStorage.setItem('userData',JSON.stringify(res.user));
        localStorage.setItem('token',res.token);

      this.router.navigateByUrl('/')

      })      
    }
  }

 
}
