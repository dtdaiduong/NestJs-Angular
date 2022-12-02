export interface Order {
  id: number;
  user_id: number;
  user_name: string;
  totalPrice: number;
  status: string;
  create_at?: Date;
  update_at?: Date;
}

export interface OrderDetail {
  product_id: number;
  quantity: number;
  price: number;
}

export interface IItem {
  product_id: number;
  quantity: number;
  price: number;
  create_at: string;
  update_at: string;
}
export interface Items {
  product: IItem[];
  into_money: number;
}
