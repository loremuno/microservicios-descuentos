import { ApiModelProperty } from "@nestjs/swagger";

export class RedeemResponseDTO {
    @ApiModelProperty({ description: 'discount id value', type: String, example: '5daa4284904f3f5b781c2264' })
    discountId: string;
    @ApiModelProperty({ description: 'order id value', type: String, example: '5daa4114904f3f32781c2264' })
    orderId: string;
}