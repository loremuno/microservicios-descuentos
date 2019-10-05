import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderDiscountSchema } from './order-discount.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'OrderDiscount', schema: OrderDiscountSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }
