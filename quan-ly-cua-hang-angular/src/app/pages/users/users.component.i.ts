import { IRoles } from "../roles/roles.model";

export interface IUser {
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  address?: string;
  roles: IRoles[];
  created_at?: string;
  updated_at?: string;
}

export interface IResUser {
  status: string;
  message: string;
  data: IUser[];
  currentPage: number;
  limit: number;
  totalCount: number;
}

export interface IAddUser {
  status?: string;
  statusCode?: number;
  message: string;
  data?: IUser;
}

export interface IEditUser {
  status?: string;
  statusCode?: number;
  message: string;
}

export interface IGetOneUser {
  statusCode?: number;
  status?: string;
  message: string;
  data?: IUser;
}

export interface IDelUser {
  statusCode?: number;
  status?: string;
  message: string;
}
