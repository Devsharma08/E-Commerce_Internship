import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { CategoriesService } from '../../../services/categories';
import { ActivatedRoute, Router } from '@angular/router';
import { categoryType } from '../../../interface/categoryType';

@Component({
  selector: 'app-category-form',
  imports: [MatInputModule,MatButtonModule,FormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm {

  CategoriesService = inject(CategoriesService)
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
      this.CategoriesService.getSingleCategory(this.id).subscribe((res:any)=>{
      this.name = res.user.name;
    })
    }   
  }

  updateCategory(){
    this.CategoriesService.updateCategory(this.id,this.name).subscribe((res)=>{
      alert('Updated successfully')
      this.isEdit = false;
      this.name = '';
      this.router.navigateByUrl('/admin/categories');
    })
  }


  addToCategory(){
    this.CategoriesService.addCategory(this.name).subscribe((res:categoryType)=>{
      console.log('added sussesful',this.name);
      alert(`${this.name} added successfully`)
      this.router.navigateByUrl('/admin/categories')
      this.name = '';
    })
  }

}
