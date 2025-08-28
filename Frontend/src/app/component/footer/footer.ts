import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  isLoggedIn:boolean = false;
  authService = inject(Auth)
  cdRef = inject(ChangeDetectorRef)

  ngOnInit(){
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cdRef.detectChanges();
  }

}
