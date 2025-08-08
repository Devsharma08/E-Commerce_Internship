export interface CartTypes {
  productId: {
    _id: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    discount: number;
    images: string;
    categoryId: string;
    brandId: string;
    isFeaturedProduct: boolean;
    isNewProduct: boolean;
  };
  userId: string;
  quantity: number;
  _id:string
}
