import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { CreateRolesDTO } from "./dto";
import { GetRoleDTO } from "./dto/get-role.dto";
import {
  EMPTY,
  map,
  mergeMap,
  of,
  throwIfEmpty,
  forkJoin,
  catchError,
  throwError,
  Observable,
  switchMap,
} from "rxjs";
import {
  findAll,
  ResponseData,
  ResponseStatusMess,
} from "../shared/types/response";
import { Roles } from "./interface";

@Injectable()
export class RolesService {
  constructor(private readonly sql: SqlConnectService) {}

  create(data: CreateRolesDTO): Observable<ResponseData<Roles>> {
    const sqlQuery = this.sql.readFileSQL("roles/insertRole.sql");

    return this.sql.query1(sqlQuery, [data.name]).pipe(
      map((res) => ({
        status: "success",
        message: "create role successfully",
        data: {
          id: res.rows[0].id,
          name: data.name,
        },
      })),
      catchError((err) => {
        if (err.code === "23505")
          throw new ConflictException("Name Role already exists");
        throw new InternalServerErrorException();
      }),
    );
  }

  findAll(
    page = 1,
    limit = 5,
    search = "",
    key: string,
    sort: string,
  ): Observable<findAll<Roles[]>> {
    const offset = (page - 1) * limit;
    const searchTxt = `%${search}%`;
    const sqlQuery = this.sql.readFileSQL("roles/searchRole.sql");
    // const sqlSearch = `WHERE name ILIKE '${searchTxt}' ORDER BY id ASC `;
    let sqlSearch = `WHERE name ILIKE '${searchTxt}'`;
    if (key && sort) {
      sqlSearch = sqlSearch + ` ORDER BY ${key} ${sort} `;
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
        // console.log("r", Count.rowCount);
        // console.log(data.rowCount);
        const total = Count.rowCount;
        return {
          status: "success",
          message: "Get list successfully",
          data: data.rows,
          currentPage: +page,
          limit: +limit,
          totalCount: total,
        };
      }),
    );
  }

  findOne(dto: GetRoleDTO): Observable<ResponseData<Roles>> {
    const sqlQuery = this.sql.readFileSQL("roles/searchRole.sql");
    return this.sql
      .query1(sqlQuery.replace("{condition}", "WHERE id = $1"), [dto.id])
      .pipe(
        mergeMap((res) => {
          return res.rows[0] ? of(res.rows[0]) : EMPTY;
        }),
        throwIfEmpty(
          () => new NotFoundException(`Not Found role by id: ${dto.id}`),
        ),
        map((data) => ({
          status: "success",
          message: "get role by id successfully",
          data: data,
        })),
        catchError((err) => {
          if (err.status === 404)
            throw new NotFoundException(`Not Found Role by id: ${dto.id}`);
          return throwError(() => new Error(err));
        }),
      );
  }

  update(id: number, role: CreateRolesDTO): Observable<ResponseStatusMess> {
    const sqlQuery = this.sql.readFileSQL("roles/updateRole.sql");
    return this.sql.query1(sqlQuery, [role.name, id]).pipe(
      mergeMap((res) => (res.rowCount === 1 ? of(res.rowCount) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`Not found role by id:${id}`)),
      map(() => ({
        status: "success",
        message: "Update role successfully",
      })),
      catchError((err) => {
        if (err.status === 404)
          throw new NotFoundException(`Not Found Role by id: ${id}`);
        if (err.code === "23505")
          throw new ConflictException("Name Role already exists");
        return throwError(() => new Error(err));
      }),
    );
  }

  delete(id: number): Observable<ResponseStatusMess> {
    const params = [id];
    const sqlQueryCheck = this.sql.readFileSQL(
      "roles/check-User-Use-Roles.sql",
    );
    const sqlQueryDel = this.sql.readFileSQL("roles/deleteRole.sql");
    return this.sql.query1(sqlQueryCheck, params).pipe(
      map((res) => res.rowCount),
      switchMap((rowCount) => {
        if (rowCount !== 0) {
          throw new ConflictException("Roles is already in use");
        } else {
          return this.sql.query1(sqlQueryDel, [id]).pipe(
            mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
            throwIfEmpty(() => new NotFoundException()),
            map(() => ({
              status: "success",
              message: "Deleted Roles successfully",
            })),
            catchError((err) => {
              if (err.status == 404) {
                return throwError(
                  () => new NotFoundException(`Not found Roles by id: ${id}`),
                );
              }
              return throwError(() => new Error(err));
            }),
          );
        }
      }),
    );
  }
}
