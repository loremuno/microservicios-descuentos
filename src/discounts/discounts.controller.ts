import { Controller, Get, Post, Req, Body, HttpCode, Headers, Patch, Param, UseGuards, HttpException, HttpStatus, Catch, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Discount } from './discount.interface';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { CreateDiscountDTO } from '../dto/createDiscountDTO';
import { DeletedDiscountDTO } from '../dto/deletedDiscountDTO';
import { ModifiedDiscountDTO } from '../dto/modifiedDiscountDTO';
import { ModifyDiscountDTO } from '../dto/modifyDiscountDTO';

@ApiUseTags('discounts')
@Controller('discounts')
@Catch(HttpException)
@UseGuards(AuthGuard)
export class DiscountsController {
    constructor(
        private discountsService: DiscountsService,
    ) { }

    @ApiResponse({ status: 200, description: 'OK.', type: [Discount] })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Get()
    findAll(): Promise<Discount[]> {
        return this.discountsService.findAll();
    }

    @ApiResponse({ status: 200, description: 'OK.', type: Discount })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Get(':discountId')
    findById(@Param('discountId') id: string): Promise<Discount> {
        return this.discountsService.findById(id);
    }

    @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: Discount})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    @Post()
    create(@Body() createDiscountDTO: CreateDiscountDTO): Observable<Discount> {
        return this.discountsService.create(createDiscountDTO);
    }

    @ApiResponse({ status: 200, description: 'The record has been successfully modified.', type: ModifiedDiscountDTO })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Patch(':id')
    update(@Param('discountId') id: string, @Body() discount: ModifyDiscountDTO): Observable<Discount> {
        return this.discountsService.update(id, discount);
    }

    @ApiResponse({ status: 200, description: 'OK.', type: DeletedDiscountDTO })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @Delete(':discountId')
    remove(@Param('discountId') id: string) {
        return this.discountsService.remove(id);
    }
}