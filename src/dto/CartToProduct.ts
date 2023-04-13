import { Product } from "./Product";

export interface CartToProduct {
  cartId: number;
  cartToProductId: number;
  count: number;
  productId: number;
  product: Array<Product>;
}
