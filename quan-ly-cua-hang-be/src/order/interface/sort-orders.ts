import { IsIn, IsOptional } from "class-validator";

export class ordersSort {
  @IsOptional()
  @IsIn(["firstname", "create_at", "update_at"])
  key: string;

  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  sort: string;
}
