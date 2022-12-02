import { IsArray, IsNumber } from "class-validator";

export class CreateOrder {
  @IsNumber()
  user_id: number;
  @IsArray()
  product: Product[];
}

export class Product {
  @IsNumber()
  id: number;
  @IsNumber()
  quantity: number;
}
