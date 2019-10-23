import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDiscountController } from './order-discount.controller';
import { OrderDiscountService } from './order-discount.service';
import { OrderDiscountSchema } from './order-discount.schema';
import { AuthModule } from '../auth/auth.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    DiscountsModule,
    MongooseModule.forFeature([{ name: 'OrderDiscount', schema: OrderDiscountSchema }]),
  ],
  controllers: [OrderDiscountController],
  providers: [OrderDiscountService]
})
export class OrderDiscountModule { }
