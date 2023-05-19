export interface Product {
  [x: string]: any;
  createdAt: String;
  description: String;
  id: number;
  image: string;
  name: String;
  price: number;
  stock: number;
  type: boolean;
  updatedAt: String;
  cartToProductOption: Array<any>;
}
