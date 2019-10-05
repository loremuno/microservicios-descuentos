import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { DiscountSchema } from './discount.schema';
import { AuthModule } from '../auth/auth.module';
import { DiscountsSearchController } from './discounts-search.controller';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Discount', schema: DiscountSchema }]),
  ],
  controllers: [DiscountsController, DiscountsSearchController],
  providers: [DiscountsService]
})
export class DiscountsModule { }
