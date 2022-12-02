import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRolesDTO } from "./dto";
import { GetRoleDTO } from "./dto/get-role.dto";
import { paginationParams } from "../shared/types/paginationParams";
import { Observable } from "rxjs";
import {
  findAll,
  ResponseData,
  ResponseStatusMess,
} from "../shared/types/response";
import { Roles } from "./interface";
import { rolesSort } from "./interface/sort-roles";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  CreateRoles(@Body() data: CreateRolesDTO): Observable<ResponseData<Roles>> {
    return this.rolesService.create(data);
  }

  @Get()
  findAll(
    @Query("search") search: string,
    @Query() { page, limit }: paginationParams,
    @Query() { key, sort }: rolesSort,
  ): Observable<findAll<Roles[]>> {
    return this.rolesService.findAll(page, limit, search, key, sort);
  }

  @Get("/:id")
  GetRole(@Param() dto: GetRoleDTO): Observable<ResponseData<Roles>> {
    return this.rolesService.findOne(dto);
  }

  @Put("/:id")
  PutRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() role: CreateRolesDTO,
  ): Observable<ResponseStatusMess> {
    return this.rolesService.update(id, role);
  }

  @Delete("/:id")
  DeleteRole(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<ResponseStatusMess> {
    return this.rolesService.delete(id);
  }
}
