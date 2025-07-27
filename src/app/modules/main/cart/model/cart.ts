export interface CartModel {
  id: number;
  userId: number;
  date: string;
  products: ProductInCart[];
}

export interface ProductInCart {
  productId: number;
  quantity: number;
}
