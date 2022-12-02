export interface ICategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IListCategory {
  status: string;
  message: string;
  data: ICategory[];
  currentPage: number;
  totalPage: number;
  limit: number;
  totalCount: number;
  search?: string;
}

export interface IOneCategory {
  status: string;
  message: string;
  data: ICategory;
}
export interface ICategoryPaginator {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalCount: number;
  search: string;
}

export interface ResponseAPI {
  status: string;
  statusCode?: number;
  message: string;
  error?: string;
  data?: ICategory;
}

export interface ISort {
  col: string;
  criteria: string;
}
