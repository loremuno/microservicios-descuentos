import { ApiModelProperty } from "@nestjs/swagger";

export class OrderDTO {
    @ApiModelProperty({ description: 'order id value', type: String, example: '5daa4114904f3f32781c2264' })
    orderId: string;
}