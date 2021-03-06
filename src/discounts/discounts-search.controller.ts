import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Discount } from './discount.interface';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { SearchQueryDTO } from '../dto/searchQueryDTO';
@ApiUseTags('search-discounts')
@Controller('search/discounts')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class DiscountsSearchController {
    constructor(
        private discountsService: DiscountsService,
    ) { }

    @ApiResponse({ status: 200, description: 'OK.', type: [Discount] })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Get()
    findByParameter(@Query() query: SearchQueryDTO): Observable<Discount> {
        return this.discountsService.findByParameter(query);
    }

}