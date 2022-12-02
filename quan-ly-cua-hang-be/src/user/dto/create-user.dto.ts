import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateUser {
  @IsNotEmpty()
  firstname: string;

  @IsOptional()
  lastname?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  roles: number[];
}
