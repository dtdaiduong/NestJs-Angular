import { IsIn, IsOptional } from "class-validator";

export class categorySort {
  @IsOptional()
  @IsIn(["name", "created_at", "updated_at"])
  key: string;

  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  sort: string;
}
