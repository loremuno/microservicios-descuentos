import { ApiModelProperty } from "@nestjs/swagger";

export class ModifiedDiscountDTO {
    @ApiModelProperty({ description: 'discount id value', type: String, example: '5daa4284904f3f5b781c2264' })
    _id: String;
    @ApiModelProperty({ description: 'modified date value', type: Date, example: '2019-10-23T21:43:06.332Z' })
    modified: Date;
}