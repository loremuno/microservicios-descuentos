import { ApiModelProperty } from '@nestjs/swagger';

export class Discount {
    @ApiModelProperty({ description: 'discount id value', type: String, example: '5daa4284904f3f5b781c2264' })
    readonly _id: String;
    @ApiModelProperty({ description: 'created date value', type: Date, example: '2019-10-23T21:43:06.332Z' })
    created: Date;
    @ApiModelProperty({ description: 'modified date value', type: Date, example: '2019-10-23T21:43:06.332Z' })
    modified: Date;
    @ApiModelProperty({ description: 'percentage value', type: Number, example: '20' })
    percentage: number;
    @ApiModelProperty({ description: 'if discount is redeemed or not value', type: Boolean, example: 'false' })
    redeemed: boolean;
    @ApiModelProperty({ description: 'endLife date value', type: Date, example: '01/01/2019' })
    endLife: Date;
    @ApiModelProperty({ enum: ['active', 'deleted'], description: 'status value of discount', type: String, example: 'active' })
    status: string;
}