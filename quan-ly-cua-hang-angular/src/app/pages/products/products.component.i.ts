import { ICategory } from "../categories/categories.component.i";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ICategory[];
  created_at: string;
  updated_at: string;
}

export interface IListProduct {
  status: string;
  message: string;
  data: IProduct[];
  currentPage: number;
  totalPage: number;
  limit: number;
  totalCount: number;
  search: string;
}

export interface IOneProduct {
  status: string;
  message: string;
  data: IProduct;
}

export interface ResponseAPI {
  status: string;
  statusCode?: number;
  message: string;
  error?: string;
  data?: IProduct;
}

export interface ISort {
  col: string;
  criteria: string;
}
