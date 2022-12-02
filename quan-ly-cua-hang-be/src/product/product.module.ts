import { Module } from "@nestjs/common";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [SqlConnectModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
