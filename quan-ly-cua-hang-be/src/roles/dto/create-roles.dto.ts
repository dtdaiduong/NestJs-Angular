import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolesDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
