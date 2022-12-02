import { IsNotIn, IsNumberString, IsOptional } from "class-validator";

export class paginationParams {
  @IsOptional()
  @IsNumberString()
  @IsNotIn(["0"])
  page: number;
  @IsOptional()
  @IsNumberString()
  limit: number;
}
