import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  catchError,
  EMPTY,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwIfEmpty,
  forkJoin,
  throwError,
} from "rxjs";
import {
  findAll,
  ResponseData,
  ResponseStatusMess,
} from "../shared/types/response";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { Category } from "./interface";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";

@Injectable()
export class CategoryService {
  constructor(private readonly sql: SqlConnectService) {}
  postg = new PostgresConfig();
  queryClone = new SqlConnectService(this.postg);
  findOne(id: number): Observable<ResponseData<Category>> {
    const sqlQuery = this.sql.readFileSQL("category/select-category.sql");
    const params = [id];

    return this.sql
      .query1(sqlQuery.replace("{condition}", "WHERE id = $1"), params)
      .pipe(
        mergeMap((res) => (res.rows[0] ? of(res.rows[0] as Category) : EMPTY)),
        throwIfEmpty(() => new NotFoundException()),
        map((data) => {
          return {
            status: "success",
            message: "Get category successfully",
            data,
          };
        }),
        catchError((err) => {
          this.throwErrorBind(err, id);
          return throwError(() => new Error(err));
        }),
      );
  }

  findAll(
    page = 1,
    limit = 5,
    search = "",
    key?: string,
    sort?: string,
  ): Observable<findAll<Category>> {
    const offset = (page - 1) * limit;
    const searchTxt = `%${search}%`;
    const sqlQuery = this.sql.readFileSQL("category/select-category.sql");
    let sqlSearch = `WHERE name ILIKE '${searchTxt}'`;
    if (key && sort) {
      sqlSearch = sqlSearch + ` ORDER BY ${key} ${sort} `;
    } else {
      sqlSearch = sqlSearch + ` ORDER BY id asc `;
    }
    const work = {
      data: this.sql.query1(
        sqlQuery.replace(
          "{condition}",
          sqlSearch + `OFFSET ${offset} LIMIT ${limit}`,
        ),
      ),
      Count: this.sql.query1(sqlQuery.replace("{condition}", sqlSearch)),
    };
    return forkJoin(work).pipe(
      map(({ data, Count }) => {
        const total = Count.rowCount;
        return {
          status: "success",
          message: "Get list category successfully",
          data: data.rows,
          currentPage: +page,
          totalPage: Math.ceil(total / limit),
          limit: +limit,
          totalCount: total,
        };
      }),
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
    );
  }

  create(name: string): Observable<ResponseData<Category>> {
    const sqlQuery = this.sql.readFileSQL("category/insert-category.sql");
    const params = [name];
    return this.sql.query1(sqlQuery, params).pipe(
      mergeMap((res) => {
        return this.findOne(res.rows[0].id);
      }),
      map((res) => {
        return {
          status: "success",
          message: "Created category successfully",
          data: res.data,
        };
      }),
      catchError((err) => {
        this.throwErrorBind(err, null);
        return throwError(() => new Error(err));
      }),
    );
  }

  update(name: string, id: number): Observable<ResponseData<Category>> {
    const sqlQuery = this.sql.readFileSQL("category/update-category.sql");
    const params = [name, id];

    return this.sql.query1(sqlQuery, params).pipe(
      mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`Not found category by id: ${id}`),
      ),
      map(() => ({
        status: "success",
        message: "Updated category successfully",
        data: {
          id,
          name,
        },
      })),
      catchError((err) => {
        this.throwErrorBind(err, id);
        return throwError(() => new Error(err));
      }),
    );
  }

  delete(id: number): Observable<ResponseStatusMess> {
    const params = [id];
    const sqlQueryCheck = this.sql.readFileSQL(
      "product_category/select-product-category-by-category-id.sql",
    );
    const sqlQueryDel = this.sql.readFileSQL("category/delete-category.sql");
    return this.sql.query1(sqlQueryCheck, params).pipe(
      map((data) => {
        return {
          check: data.rowCount,
        };
      }),
      switchMap((res) => {
        if (res.check > 0) {
          throw new ConflictException("Product category is already in use");
        } else {
          return this.queryClone.query1(sqlQueryDel, [id]).pipe(
            mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
            throwIfEmpty(
              () => new NotFoundException(`Not found category by id: ${id}`),
            ),
            map(() => ({
              status: "success",
              message: "Deleted category successfully",
            })),
            catchError((err) => {
              this.throwErrorBind(err, id);
              return throwError(() => new Error(err));
            }),
          );
        }
      }),
    );
  }
  throwErrorBind(err, param) {
    if (err.code === "23505") {
      throw new ConflictException("Name Category already exists");
    }
    if (err.status === 404)
      throw new NotFoundException(`Not Found category by id: ${param}`);
  }
}
