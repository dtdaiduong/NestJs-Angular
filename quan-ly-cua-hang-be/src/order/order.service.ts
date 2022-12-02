import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EMPTY,
  map,
  switchMap,
  mergeMap,
  Observable,
  of,
  throwIfEmpty,
  catchError,
  forkJoin,
  throwError,
} from "rxjs";
import { findAll, ResponseData } from "../shared/types/response";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { CreateOrder, UpdateOrder } from "../order/dto";
import { Order, OrderDetail } from "../order/interface";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class OrderService {
  constructor(private readonly sql: SqlConnectService) {}
  /**
   *
   * @param page
   * @param limit
   * @returns
   */
  findAll(
    page = 1,
    limit = 5,
    search = "",
    key: string,
    sort: string,
  ): Observable<findAll<Order>> {
    const offset = (page - 1) * limit;
    const sqlSelectAllOrder = this.sql.readFileSQL(
      "order/select-all-order.sql",
    );

    let sqlSearch = `where p.firstname like '%${search}%' order by o.id DESC `;
    if (key && sort) {
      sqlSearch = sqlSearch.replace(
        "order by o.id DESC",
        ` ORDER BY ${key} ${sort} `,
      );
    }
    const a = {
      data: this.sql.query1(
        sqlSelectAllOrder.replace(
          "{x}",
          sqlSearch + `OFFSET ${offset} LIMIT ${limit}`,
        ),
      ),
      totalCount: this.sql.query1(sqlSelectAllOrder.replace("{x}", sqlSearch)),
    };

    return forkJoin(a).pipe(
      map(({ data, totalCount }) => {
        const total = totalCount.rowCount;
        return {
          status: "success",
          message: "Get list successful",
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
  /**
   *
   * @param order_id
   * @returns
   */
  findOne(order_id: number): Observable<ResponseData<Order>> {
    const sqlSelectOrder = this.sql.readFileSQL("order/select-order-by-id.sql");
    const params = [order_id];
    return this.sql.query1(sqlSelectOrder, params).pipe(
      mergeMap((res) => (res.rows[0] ? of(res.rows[0] as Order) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`Not found order by Id: ${order_id}`),
      ),
      map((data) => {
        return {
          status: "success",
          message: "Get order successfully",
          data,
        };
      }),
      catchError((err) => {
        this.throwErrorStatus(err.status);
        return throwError(() => new Error(err));
      }),
    );
  }

  /**
   *
   * @param dto
   * @returns
   */
  createOrder(dto: CreateOrder): Observable<ResponseData<OrderDetail[]>> {
    let sqlSumTotalPrice = this.sql.readFileSQL("order/sum-total-price.sql");
    let getPriceOfProduct = ``;
    dto.product.forEach((id) => {
      getPriceOfProduct += `SELECT price*${id.quantity} AS total_price FROM products where id = ${id.id} UNION ALL `;
    });
    sqlSumTotalPrice = sqlSumTotalPrice.replace(
      `getPriceOfProduct`,
      getPriceOfProduct.substring(0, getPriceOfProduct.length - 11),
    );
    return this.sql.query1(sqlSumTotalPrice).pipe(
      switchMap((sum) => {
        const sqlInsertOrder = this.sql.readFileSQL("order/insert-order.sql");
        const params = [dto.user_id, sum.rows[0].sum];
        let sqlInsertDetail = this.sql.readFileSQL(
          "order/insert-order-detail.sql",
        );
        let getValuesDetail = ``;
        return this.sql.query1(sqlInsertOrder, params).pipe(
          map((res) => res.rows[0].id),
          switchMap((id) => {
            dto.product.forEach((e) => {
              getValuesDetail += ` (${id}, ${e.id}, ${e.quantity}, (select price from products where id = ${e.id}) ),`;
            });
            sqlInsertDetail = sqlInsertDetail.replace(
              `getValuesDetail`,
              getValuesDetail.substring(0, getValuesDetail.length - 1),
            );
            return this.sql.query1(sqlInsertDetail);
          }),
          switchMap(() => {
            return of({
              status: "success",
              message: "Created order detail successfully",
            });
          }),
          catchError((err) => {
            if (
              err.constraint === "orders_fk" ||
              err.constraint === "order_detail_product_fk"
            ) {
              return throwError(
                () =>
                  new HttpException(
                    "This user or product does not exist",
                    HttpStatus.NOT_FOUND,
                  ),
              );
            }
            return throwError(() => new Error(err));
          }),
        );
      }),
    );
  }
  /**
   *
   * @param order_id
   * @param dto
   * @returns
   */
  updateOrder(order_id: number, dto: UpdateOrder) {
    const sqlStatus = this.sql.readFileSQL("order/select-status.sql");
    const sqlDeleteOrder = this.sql.readFileSQL(
      "order/delete-order-detail.sql",
    );
    const params = [order_id];
    const sqlUpdateOrder = this.sql.readFileSQL("order/update-order-price.sql");
    return this.sql.query1(sqlStatus, params).pipe(
      mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
      throwIfEmpty(() => new NotFoundException("The orders does not exist")),
      switchMap((res) => {
        if (res.rows[0].status === "draft") {
          return this.sql.query1(sqlDeleteOrder, params).pipe(
            switchMap(() => {
              let sqlInsertDetail = this.sql.readFileSQL(
                "order/insert-order-detail.sql",
              );
              let getValuesDetail = ``;
              dto.product.forEach((e) => {
                if (e.quantity !== 0) {
                  getValuesDetail += ` (${order_id}, ${e.id}, ${e.quantity}, (select price from products where id = ${e.id}) ),`;
                }
              });
              sqlInsertDetail = sqlInsertDetail.replace(
                `getValuesDetail`,
                getValuesDetail.substring(0, getValuesDetail.length - 1),
              );
              return this.sql.query1(sqlInsertDetail).pipe(
                switchMap(() => {
                  return this.sql.query1(sqlUpdateOrder, params);
                }),
              );
            }),
            map(() => {
              return {
                status: "success",
                message: "update order successful",
              };
            }),
          );
        } else {
          return throwError(
            () =>
              new HttpException(
                "Paid orders cannot be update",
                HttpStatus.FORBIDDEN,
              ),
          );
        }
      }),
      catchError((err) => {
        if (err.constraint === "order_detail_product_fk") {
          throw new HttpException(
            "This product does not exist",
            HttpStatus.NOT_FOUND,
          );
        }
        if (err.status === 404) {
          throw new HttpException(
            "The order does not exist",
            HttpStatus.NOT_FOUND,
          );
        }
        if (err.status === 403) {
          throw new HttpException(
            "Paid orders cannot be update",
            HttpStatus.FORBIDDEN,
          );
        }
        return throwError(() => new Error(err));
      }),
    );
  }

  /**
   *
   * @param order_id
   * @returns
   */
  updateOrderPaying(order_id: number) {
    const sqlUpdateStatus = this.sql.readFileSQL("order/update-status.sql");
    const params = [order_id];
    return this.sql.query1(sqlUpdateStatus, params).pipe(
      mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
      throwIfEmpty(() => new NotFoundException("The order does not exist")),
      map(() => {
        return {
          status: "success",
          message: "The Order payment successful",
        };
      }),
      catchError((err) => {
        this.throwErrorStatus(err.status);
        return throwError(() => new Error(err));
      }),
    );
  }

  /**
   *
   * @param order_id
   * @returns
   */
  deleteOrder(order_id: number) {
    const sqlStatus = this.sql.readFileSQL("order/select-status.sql");
    const sqlDeleteDetail = this.sql.readFileSQL(
      "order/delete-order-detail.sql",
    );
    const sqlDeleteOrder = this.sql.readFileSQL("order/delete-order.sql");
    const params = [order_id];
    return this.sql.query1(sqlStatus, params).pipe(
      mergeMap((res) => (res.rowCount === 1 ? of(res) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`Not found order by id: ${order_id}`),
      ),
      switchMap((res) => {
        if (res.rows[0].status === "draft") {
          return this.sql.query1(sqlDeleteDetail, params).pipe(
            map(() => {
              return this.sql.query1(sqlDeleteOrder, params);
            }),
            switchMap(() => {
              return of({
                status: "success",
                message: "Deleted successful",
              });
            }),
          );
        } else {
          return throwError(
            () =>
              new HttpException(
                "Paid orders cannot be deleted",
                HttpStatus.FORBIDDEN,
              ),
          );
        }
      }),
      catchError((err) => {
        this.throwErrorStatus(err.status);
        return throwError(() => new Error(err));
      }),
    );
  }

  throwErrorStatus(test: number) {
    if (test === 403) {
      throw new HttpException(
        "Paid orders cannot be deleted",
        HttpStatus.FORBIDDEN,
      );
    }
    if (test === 404) {
      throw new HttpException("The order does not exist", HttpStatus.NOT_FOUND);
    }
  }
}
