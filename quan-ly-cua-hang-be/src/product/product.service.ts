import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  catchError,
  EMPTY,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwError,
  throwIfEmpty,
} from "rxjs";
import {
  findAll,
  getAllProduct,
  ResponseData,
  ResponseStatusMess,
} from "src/shared/types/response";
import * as fs from "fs";
import { URL_IMAGE } from "../constants";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { DeleteImageFile } from "../utils/deleteImageFile";
import { CreateProduct, UpdateProduct } from "./dto";
import { Product } from "./interface";

@Injectable()
export class ProductService {
  constructor(private readonly sql: SqlConnectService) {}

  findAll(
    page = 1,
    limit = 5,
    search = "",
    category_id = "[]",
    column = "",
    options = "",
  ): Observable<findAll<Product> | getAllProduct[]> {
    if (+page === 0) {
      const sqlQuery = this.sql.readFileSQL("product/select-all-product.sql");
      return this.sql
        .query1(sqlQuery.replace("{condition}", ""))
        .pipe(map((res) => res.rows));
    } else {
      const offset = (page - 1) * limit;
      const searchTxt = `%${search}%`;
      const sqlQuery = this.sql.readFileSQL("product/search-product.sql");
      let sqlSearch;
      if (JSON.parse(`${category_id}`).length !== 0) {
        category_id = JSON.parse(`${category_id}`);
        sqlSearch = `, product_category pc2 WHERE pc2.product_id = p.id AND p."name" ILIKE '${searchTxt}' and
        pc2.category_id = ANY(ARRAY[${category_id}]::int[]) `;
      } else {
        sqlSearch = `WHERE p."name" ILIKE '${searchTxt}' `;
      }

      let dataQuery = sqlQuery.replace("{condition}", sqlSearch);
      if (column != "" && options != "") {
        dataQuery += `ORDER BY p.${column} ${options}`;
      }
      const work = {
        count: this.sql.query1(dataQuery),
        data: this.sql.query1(dataQuery + ` OFFSET ${offset} LIMIT ${limit}`),
      };

      return forkJoin(work).pipe(
        map(({ data, count }) => {
          console.log(count.rowCount);
          console.log(count.rowCount);

          const total = count.rowCount;
          return {
            status: "success",
            message: "Get list product successfully",
            data: data.rows,
            currentPage: +page,
            totalPage: Math.ceil(total / limit),
            limit: +limit,
            totalCount: total,
          };
        }),
      );
    }
  }

  findOne(id: number): Observable<ResponseData<Product>> {
    const sqlQuery = this.sql.readFileSQL("product/search-product.sql");
    const params = [id];

    return this.sql
      .query1(sqlQuery.replace("{condition}", "WHERE id=$1"), params)
      .pipe(
        mergeMap((res) => (res.rows[0] ? of(res.rows[0] as Product) : EMPTY)),
        throwIfEmpty(
          () => new NotFoundException(`Not found product by id: ${id}`),
        ),
        map((data) => {
          return {
            status: "success",
            message: "Get product successfully",
            data,
          };
        }),
        catchError((err) => {
          if (err.status === 404)
            throw new NotFoundException(`Not found Product by id : ${id}`);
          return throwError(() => new Error(err));
        }),
      );
  }

  create(dto: CreateProduct, path: string): Observable<ResponseData<Product>> {
    const sqlQuery = this.sql.readFileSQL("product/insert-product.sql");
    const params = [
      dto.name,
      dto.description,
      +dto.price,
      `${URL_IMAGE}${path}`,
    ];
    let idProduct;
    return this.sql.query1(sqlQuery, params).pipe(
      map((res) => res.rows[0].id),
      switchMap((id) => {
        idProduct = id;
        const arrCate = dto.category.split(",").map((e) => +e);
        const sqlInsert =
          "insert into product_category(product_id, category_id) values ";
        let sqlValue = "";
        arrCate.forEach((category_id) => {
          sqlValue += ` (${id}, ${category_id}),`;
        });
        sqlValue = sqlValue.substring(0, sqlValue.length - 1);
        return this.sql.query1(sqlInsert + sqlValue);
      }),
      switchMap(() => {
        return this.findOne(idProduct).pipe(
          map((res) => res.data),
          map((data) => {
            return {
              status: "success",
              message: "Created product successfully",
              data,
            };
          }),
        );
      }),
      catchError((err) => {
        if (err.code === "23505")
          throw new ConflictException("Name Product already exists");
        throw new InternalServerErrorException();
      }),
    );
  }

  update(
    id: number,
    dto: UpdateProduct,
    path?: string,
  ): Observable<ResponseStatusMess> {
    console.log(11);
    const updateQuery = this.sql.readFileSQL("product/update-product.sql");
    const deleteQuery = this.sql.readFileSQL(
      "product_category/delete-product-category-by-product-id.sql",
    );
    const insertQuery = this.sql.readFileSQL(
      "product_category/insert-product-category.sql",
    );
    // merge query insert
    const newCategory = dto.category.split(",").map((e) => +e);
    let sqlValue = "";
    newCategory.forEach((category_id) => {
      sqlValue += ` (${id}, ${category_id}),`;
    });
    sqlValue = sqlValue.substring(0, sqlValue.length - 1);
    return this.findOne(id).pipe(
      map((res) => res.data),
      mergeMap((data) => {
        const url = data.image;
        const paths = "uploads" + url.split("uploads")[1];
        const params = [
          dto.name,
          dto.description,
          +dto.price,
          path ? `${URL_IMAGE}${path}` : url,
          id,
        ];
        return this.sql.query1(updateQuery, params).pipe(
          mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
          throwIfEmpty(
            () => new NotFoundException(`Not found product by id: ${id}`),
          ),
          switchMap(() => {
            if (path && url !== "" && fs.existsSync(paths))
              DeleteImageFile(paths);
            console.log("logsds", "sdsa");
            return this.sql.query1(deleteQuery, [id]);
          }),
          switchMap(() => {
            return this.sql.query1(insertQuery + sqlValue);
          }),
          map(() => {
            return {
              status: "success",
              message: "Updated product successfully",
            };
          }),
        );
      }),
      catchError((err) => {
        if (err.status === 404)
          throw new NotFoundException(`Not Found product by id: ${id}`);
        if (err.code === "23505")
          throw new ConflictException("Name product already exists");
        return throwError(() => new Error(err));
      }),
    );
  }

  delete(id: number): Observable<ResponseStatusMess> {
    const queryCheck = this.sql.readFileSQL(
      "product/check-product-is-using-in-order.sql",
    );
    return this.sql.query1(queryCheck, [id]).pipe(
      switchMap((data) => (data.rowCount > 0 ? EMPTY : of(data.rowCount))),
      throwIfEmpty(
        () =>
          new ConflictException(
            "Product is already in Order Details use, cannot delete it",
          ),
      ),
      switchMap(() => {
        return this.findOne(id).pipe(
          map((res) => res.data),
          switchMap((dataRes) => {
            const queryDel = this.sql.readFileSQL(
              "product/delete-product-by-id.sql",
            );
            const queryDelPC = queryDel
              .replace("products", "product_category")
              .replace("id", "product_id");
            const delWork = {
              delProdCate: this.sql.query1(queryDelPC, [dataRes.id]),
              delProduct: this.sql.query1(queryDel, [dataRes.id]),
            };
            return forkJoin(delWork).pipe(
              map(({ delProdCate, delProduct }) => {
                return {
                  delPCCount: delProdCate.rowCount,
                  delPCount: delProduct.rowCount,
                  productData: dataRes,
                };
              }),
              mergeMap((res) => (res.delPCount === 1 ? of(res) : EMPTY)),
              throwIfEmpty(
                () => new NotFoundException(`Not found product by id: ${id}`),
              ),
              map((res) => {
                const url = res.productData.image;
                const paths = "uploads" + url.split("uploads")[1];
                if (url && fs.existsSync(paths)) {
                  DeleteImageFile(paths);
                }
                return {
                  status: "success",
                  message: "Deleted product successfully",
                };
              }),
              catchError((err) => {
                if (err.status === 404)
                  throw new NotFoundException(
                    `Not found Product by id : ${id}`,
                  );
                return throwError(() => new Error(err));
              }),
            );
          }),
        );
      }),
    );
  }
}
