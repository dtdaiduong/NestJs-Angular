import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";
import { RolesModule } from "./roles/roles.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    ProductModule,
    RolesModule,
    UserModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
