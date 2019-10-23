import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscountsModule } from './discounts/discounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDiscountModule } from './orders/order-discount.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    DiscountsModule,
    OrderDiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
