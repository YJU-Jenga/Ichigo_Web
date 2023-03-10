export interface Cart {
  id: number;
  userId: number;
  createdAt: String;
  updatedAt: String;
  cartToProducts: Array<any>;
}
