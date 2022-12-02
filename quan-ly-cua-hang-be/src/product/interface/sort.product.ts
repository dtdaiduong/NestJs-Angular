import { IsIn, IsOptional } from "class-validator";

export class sort {
  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  options: string;

  @IsOptional()
  @IsIn(["name", "price", "id", "description"])
  column: string;
}
