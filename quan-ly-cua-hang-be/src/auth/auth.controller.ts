import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto";
import { LocalAuthGuard } from "./guards";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post("login")
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post("register")
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }
}
