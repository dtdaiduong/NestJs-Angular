import { IsArray, IsNumber } from "class-validator";

export class UpdateOrder {
  @IsArray()
  product: UpProduct[];
}
export class UpProduct {
  @IsNumber()
  id: number;
  @IsNumber()
  quantity: number;
}
