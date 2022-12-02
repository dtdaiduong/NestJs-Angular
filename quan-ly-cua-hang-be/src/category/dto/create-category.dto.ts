import { IsNotEmpty } from "class-validator";

export class CreateCategory {
  @IsNotEmpty()
  name: string;
}
