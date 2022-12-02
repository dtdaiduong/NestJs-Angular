import { IsNotEmpty } from "class-validator";

export class UpdateProduct {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  category: string;
}
