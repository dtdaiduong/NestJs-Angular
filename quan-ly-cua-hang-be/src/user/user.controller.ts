import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { paginationParams } from "../shared/types/paginationParams";
import { CreateUser } from "./dto";
import { UpdateUser } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { SECRETKEY_ACCESS } from "../constants";
import { sort } from "./interface/sort.user";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  @Get()
  getUsers(
    @Query("search") search: string,
    @Query("role") role: string,
    @Query() { page, limit }: paginationParams,
    @Query() { column, options }: sort,
  ) {
    return this.userService.findAll(page, limit, search, role, column, options);
  }

  @Get("token")
  getUserByToken(@Request() req) {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    const payload = this.jwt.verify(token, {
      secret: SECRETKEY_ACCESS,
    });
    return this.userService.findOne(payload.id);
  }

  @Get(":id")
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  postUser(@Body() dto: CreateUser) {
    return this.userService.create(dto);
  }

  @Put(":id")
  putUser(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUser) {
    return this.userService.update(id, dto);
  }

  @Delete(":id")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
