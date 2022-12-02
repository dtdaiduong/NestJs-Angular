import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, FileFilterCallback } from "multer";
import { extname } from "path";
import { Observable } from "rxjs";
import {
  findAll,
  getAllProduct,
  ResponseData,
  ResponseStatusMess,
} from "src/shared/types/response";
// import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { paginationParams } from "../shared/types/paginationParams";
import { CreateProduct, UpdateProduct } from "./dto";
import { Product } from "./interface";
import { sort } from "./interface/sort.product";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(
    @Query("search") search: string,
    @Query("category") category_id: string,
    @Query() { page, limit }: paginationParams,
    @Query() { column, options }: sort,
  ): Observable<findAll<Product> | getAllProduct[]> {
    return this.productService.findAll(
      page,
      limit,
      search,
      category_id,
      column,
      options,
    );
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<ResponseData<Product>> {
    return this.productService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("photo", {
      limits: { fileSize: 10 * 1024 * 1024 },
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const fileName = Date.now() + "-" + file.originalname;
          cb(null, fileName);
        },
      }),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback,
      ) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|jfif)$/)) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Không hỗ trợ định dạng ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      },
    }),
  )
  create(
    @Body() dto: CreateProduct,
    @UploadedFile() file,
  ): Observable<ResponseData<Product>> {
    return this.productService.create(dto, file.path);
  }

  @Put(":id")
  @UseInterceptors(
    FileInterceptor("photo", {
      limits: { fileSize: 10 * 1024 * 1024 },
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const fileName = Date.now() + "-" + file.originalname;
          cb(null, fileName);
        },
      }),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback,
      ) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|jfif)$/)) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Không hỗ trợ định dạng ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      },
    }),
  )
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProduct,
    @UploadedFile() file,
  ): Observable<ResponseStatusMess> {
    if (file) return this.productService.update(id, dto, file.path);
    return this.productService.update(id, dto);
  }

  @Delete(":id")
  delete(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<ResponseStatusMess> {
    return this.productService.delete(id);
  }
}
