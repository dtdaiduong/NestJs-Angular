import { Module } from "@nestjs/common";
import { SqlConnectModule } from "../services/sql-connect/sql-connect.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [SqlConnectModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
