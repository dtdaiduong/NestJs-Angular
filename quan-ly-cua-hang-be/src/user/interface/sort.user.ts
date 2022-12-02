import { IsIn, IsOptional } from "class-validator";

export class sort {
  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  options: string;

  @IsOptional()
  @IsIn(["firstname", "lastname", "email", "phone", "address"])
  column: string;
}
