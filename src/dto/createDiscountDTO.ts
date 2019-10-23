import { ApiModelProperty } from "@nestjs/swagger";

export class CreateDiscountDTO {
    @ApiModelProperty({ description: 'percentage value', type: Number, example: '20' })
    percentage: number;
    @ApiModelProperty({ description: 'if discount is redeemed or not value', type: Boolean, example: 'false' })
    redeemed: boolean;
    @ApiModelProperty({ description: 'endLife date value', type: Date, example: '01/01/2019' })
    endLife: Date;
}