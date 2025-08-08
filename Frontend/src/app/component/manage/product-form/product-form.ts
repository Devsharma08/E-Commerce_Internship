import { Component,inject } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product-service';
import {MatSelectModule} from '@angular/material/select';
import { CategoriesService } from '../../../services/categories';
import { BrandService } from '../../../services/brand/brand';
import { categoryType } from '../../../interface/categoryType';
import { Brand } from '../../../interface/brandType';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-product-form',
  imports: [MatInputModule,MatButtonModule,FormsModule,ReactiveFormsModule,MatSelectModule,CommonModule,MatCheckboxModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {

  productService = inject(ProductService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  categoryService = inject(CategoriesService);
  brandService = inject(BrandService)
  formBuilder = inject(FormBuilder);


  categoryList:categoryType[]=[];
  brandList:Brand[]=[];

  productForm = this.formBuilder.group({
    name:[null,[Validators.required,Validators.minLength(5)]],
    shortDescription:[null,[Validators.required,Validators.minLength(10)]],
    description:[null,[Validators.required,Validators.minLength(20)]],
    price:[null,[Validators.required]],
    discount:[null,[Validators.required]],
    images:this.formBuilder.array([]),
    categoryId:[null,[Validators.required]],
    brandId:[null,[Validators.required]],
    isFeaturedProduct:[null,[Validators.required]],
    isNewProduct:[null,[Validators.required]]
  })

  isEdit:Boolean = false
  name!:String;
  id:String = ''; 

  getAllBrands(){
    this.brandService.getAllbrand().subscribe((res:any)=>{ 
      this.brandList = res.allBrandList;
    })
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res:any)=>{
      // console.log(res.allCategoriesList);
      // console.log(res.allCategoriesList[0].name,res.allCategoriesList[0]._id);
      this.categoryList = res.allCategoriesList;
    })
  }


ngOnInit() {
  this.id = this.route.snapshot.params['id'];
  this.getAllBrands();
  this.getAllCategories();

  const isEditMode = !!this.id;
  this.isEdit = isEditMode;

  if (isEditMode) {
    this.productService.getSingleProduct(this.id).subscribe((res: any) => {
      const product = res.user;

      //patch value is only for forms like setvalue , but it even let you update single prop of the formbuilder
      this.productForm.patchValue(product);

      // Replace all images in the form array
      const imagesArray = this.images;
      imagesArray.clear();
      product.images.forEach((img: string) => imagesArray.push(this.formBuilder.control(img, Validators.required)));
    });
  } else {
    this.addImage();
  }
}



  updateProduct(){
    let value = this.productForm.value
    this.productService.updateProduct(this.id,value).subscribe((res)=>{
      alert('Updated successfully')
      this.isEdit = false;
      this.router.navigateByUrl('/admin/product');
    })
  }

  addImage(){
    this.images.push(this.formBuilder.control(null))
  }

  removeImage(){
    // console.log(this.images.controls);
    
    this.images.removeAt(this.images.controls.length - 1 )
  }

  get images(){
    // console.log(this.productForm.get('images'));    
    return this.productForm.get('images') as FormArray
  }

  addToProduct(){
    // console.log('added is ruuned');
    console.log(this.productForm.value);
    let value = this.productForm.value;
    this.productService.addProduct(value as any).subscribe((res)=>{
      // console.log('added sussesful',this.name);
      alert(`${this.name} added successfully`)
      this.router.navigateByUrl('/admin/product')
      this.name = '';
    })
  }

}

