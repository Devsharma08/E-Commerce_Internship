import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand/brand';

@Component({
  selector: 'app-brand-form',
  imports: [MatInputModule,MatButtonModule,FormsModule],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.scss'
})

export class BrandForm {

  BrandService = inject(BrandService)
  router = inject(Router)
  route = inject(ActivatedRoute)

  isEdit:Boolean = false
  name!:String;
  id:String = ''; 

  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    console.log("Id is :",this.id);

    if(this.id){
      this.isEdit = true;
      this.BrandService.getSingleBrand(this.id).subscribe((res:any)=>{
      this.name = res.user.name;
    })
    }   
  }

  updateBrand(){
    this.BrandService.updateBrand(this.id,this.name).subscribe((res)=>{
      alert('Updated successfully')
      this.isEdit = false;
      this.name = '';
      this.router.navigateByUrl('/admin/brand');
    })
  }


  addToBrand(){
    console.log('added is ruuned');
    
    this.BrandService.addBrand(this.name).subscribe((res:any)=>{
      console.log('added sussesful',this.name);
      alert(`${this.name} added successfully`)
      this.router.navigateByUrl('/admin/brand')
      this.name = '';
    })
  }

}

