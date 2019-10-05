import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Discount } from './discount.interface';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('search/discounts')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class DiscountsSearchController {
    constructor(
        private discountsService: DiscountsService,
    ) { }

    @Get()
    findByParameter(@Query() query): Observable<Discount> {
        return this.discountsService.findByParameter(query);
    }

}