import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [MatFormFieldModule,MatCardModule,MatIconModule,CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  user: any = {
    name: '',
    email: '',
    newPassword: ''
  };

  ngOnInit(): void {
    const data = localStorage.getItem('userData');
    if (data) {
      const parsed = JSON.parse(data);
      this.user.name = parsed.name;
      this.user.email = parsed.email;
    }
  }

  updateProfile(): void {
    // Optional: Hook this with backend API call
    alert('Profile update feature coming soon.');
  }

}
