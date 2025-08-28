import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { Auth } from '../../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ ReactiveFormsModule,
    RouterLink,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

   registerForm: FormGroup;
   authService = inject(Auth)

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  router = inject(Router)

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerForm;
      // console.log('User Registered:', this.registerForm);
      this.authService.userRegister(this.registerForm.value).subscribe((res:any)=>{
        alert('user registered ')
        this.router.navigateByUrl('/login')
      })
      
    }
  }


}
