import { Roles } from "../../roles/interface/index";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: number;
  phone: string;
  address: string;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: number;
  phone: string;
  address: string;
  roles: Roles[];
  created_at?: string;
  updated_at?: string;
}

export interface Users {
  id: number;
  name: string;
}
