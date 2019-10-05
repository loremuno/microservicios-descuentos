import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Discount } from './discount.interface';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@Controller('discounts')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class DiscountsController {
    constructor(
        private discountsService: DiscountsService,
    ) { }

    @Get()
    findAll(): Promise<Discount[]> {
        return this.discountsService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<Discount> {
        return this.discountsService.findById(id);
    }

    @Get('/search')
    findByParameter(@Query() query) {
        console.log("TCL: DiscountsController -> query", query)
        // return this.discountsService.findById(params.id);
    }

    @Post()
    create(@Body() discount: Discount): Observable<Discount> {
        return this.discountsService.create(discount);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() discount: Discount): Observable<Discount> {
        return this.discountsService.update(id, discount);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.discountsService.remove(id);
    }
}