import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('orders')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
    ) { }

    @Post(':orderId/redeem')
    redeem(@Param('orderId') orderId: string, @Body() discount): Observable<any> {
        return this.ordersService.redeem(orderId, discount);
    }

}