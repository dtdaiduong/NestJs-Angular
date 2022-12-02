import { roles } from "./roles.component";

export interface ResponseGetListRoles {
  data: {
    roles: roles[];
    limit: number;
    currentPage: number;
    totalPage: number;
    totalCount: number;
  };
  message: {
    status: string;
    statusCode: number;
    message: string;
    error: string;
  };
}
export interface Exchange {
  status: string;
  message: string;
  data: {
    created_at: string;
    id: number;
    name: string;
    updated_at: string;
  }[];
  currentPage: number;
  totalPage: number;
  limit: number;
  totalCount: number;
}
