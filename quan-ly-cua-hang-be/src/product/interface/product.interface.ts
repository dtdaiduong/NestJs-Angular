import { Category } from "../../category/interface";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category[];
  created_at?: Date;
  updated_at?: Date;
}
