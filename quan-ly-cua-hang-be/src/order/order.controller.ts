import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { paginationParams } from "../shared/types/paginationParams";
import { CreateOrder, UpdateOrder } from "./dto";
import { ordersSort } from "./interface/sort-orders";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAllOrders(
    @Query() { page, limit }: paginationParams,
    @Query("search") search: string,
    @Query() { key, sort }: ordersSort,
  ) {
    return this.orderService.findAll(page, limit, search, key, sort);
  }
  @Get(":id")
  getOneOrder(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Post()
  createOrder(@Body() dto: CreateOrder): Observable<unknown> {
    return this.orderService.createOrder(dto);
  }

  @Put(":id")
  updateOrder(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateOrder) {
    return this.orderService.updateOrder(id, dto);
  }

  @Put("/paying/:id")
  updateOrderPaying(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.updateOrderPaying(id);
  }

  @Delete(":id")
  deleteOrder(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
