import { IsNotEmpty } from "class-validator";

export class GetRoleDTO {
  @IsNotEmpty()
  id: string;
}
