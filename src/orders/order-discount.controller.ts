import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { OrderDiscountService } from './order-discount.service';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { RedeemResponseDTO } from '../dto/redeemResponseDTO';
import { OrderDTO } from '../dto/orderDTO';

@ApiUseTags('redeem')
@Controller('redeem')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class OrderDiscountController {
    constructor(
        private orderDiscountService: OrderDiscountService,
    ) { }

    @ApiResponse({ status: 200, description: 'OK.', type: RedeemResponseDTO })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 409, description: '[No existe la orden de compra ingresada, El codigo de descuento ya ha sido usado, La orden de compra ya tiene un descuento aplicado]' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Post(':discountId/discount')
    redeem(@Param('discountId') discountId: string, @Body() orderDTO: OrderDTO): Observable<any> {
        return this.orderDiscountService.redeem(discountId, orderDTO);
    }

}