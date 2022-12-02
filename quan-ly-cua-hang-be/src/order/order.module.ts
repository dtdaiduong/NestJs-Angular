import { Module } from "@nestjs/common";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  imports: [SqlConnectModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
