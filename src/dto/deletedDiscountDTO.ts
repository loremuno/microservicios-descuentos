import { ApiModelProperty } from "@nestjs/swagger";

export class DeletedDiscountDTO {
    @ApiModelProperty({ enum: ['active', 'deleted'], description: 'status value of discount', type: String, example: 'active' })
    status: string;
}