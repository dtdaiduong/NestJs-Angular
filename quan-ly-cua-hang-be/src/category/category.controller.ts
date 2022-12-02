import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { Observable } from "rxjs";
import { paginationParams } from "../shared/types/paginationParams";
import {
  findAll,
  ResponseData,
  ResponseStatusMess
} from "../shared/types/response";
import { CategoryService } from "./category.service";
import { CreateCategory, UpdateCategory } from "./dto";
import { Category } from "./interface";
import { categorySort } from "./interface/sort-category";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(
    @Query("search") search: string,
    @Query() { page, limit }: paginationParams,
    @Query() { key, sort }: categorySort,
  ): Observable<findAll<Category>> {
    return this.categoryService.findAll(page, limit, search, key, sort);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<ResponseData<Category>> {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCategory): Observable<ResponseData<Category>> {
    return this.categoryService.create(dto.name);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCategory,
  ): Observable<ResponseData<Category>> {
    return this.categoryService.update(dto.name, id);
  }

  @Delete(":id")
  delete(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<ResponseStatusMess> {
    return this.categoryService.delete(id);
  }
}
