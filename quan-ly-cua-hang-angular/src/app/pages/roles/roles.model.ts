export interface IRoles {
  id: number;
  name: string;
}

export interface IResRoles {
  status: string;
  message: string;
  data: IRoles[];
  currentPage: number;
  limit: number;
  totalCount: number;
}
