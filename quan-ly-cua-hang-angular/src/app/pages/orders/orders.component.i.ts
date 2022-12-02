export interface IOrder {
  order_id: number;
  user_id?: number;
  firstname: string;
  total_price: number;
  status: string;
  create_at: string;
  update_at: string;
}
export interface IListOrder {
  status: string;
  message: string;
  data: IOrder[];
  currentPage: number;
  totalPage: number;
  limit: number;
  totalCount: number;
  search?: string;
  ordersSort?: IOrder[];
  rootOrders?: IOrder[];
  key?: number;
  Action?: string;
}

export interface IProductDetail {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subprice: number;
}

export interface IOneOrder {
  status: string;
  message: string;
  data: OrderDetail;
}
export interface OrderDetail {
  id: number;
  user_id: number;
  firstname: string;
  product: IProductDetail[];
  total_price: number;
  create_at: string;
  update_at: string;
  status: string;
}
export interface ResponseOrdersAPI {
  status: string;
  statusCode?: number;
  message: string;
  error?: string;
  data?: OrderDetail;
}

export interface IOrderDetailItem {
  name: string;
  productId: number;
  quantity: number;
  price: number;
}
export interface IOrdersPaginator {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalCount: number;
  search: string;
  col: string;
  criteria: string;
}
export interface ISort {
  col: string;
  criteria: string;
}

export interface ordersSort {
  order_id: number;
  user_id: number;
  firstname: string;
  total_price: number;
  create_at: string;
  update_at: string;
  key?: number;
  Action?: string;
}

