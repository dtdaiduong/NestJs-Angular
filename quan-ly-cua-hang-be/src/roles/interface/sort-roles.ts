import { IsIn, IsOptional } from "class-validator";

export class rolesSort {
  @IsOptional()
  @IsIn(["name", "created_at", "updated_at"])
  key: string;

  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  sort: string;
}
