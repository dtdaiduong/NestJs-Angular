import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  email: string;

  @IsNotEmpty()
  @Length(6, 18)
  @IsDefined()
  password: string;

  @IsNotEmpty()
  @IsDefined()
  firstname: string;

  @IsOptional()
  lastname?: string;

  @IsNumberString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roles?: number[];
}
