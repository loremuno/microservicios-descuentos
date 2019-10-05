import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";

/**
 * @api {direct} discount/discount_update Cambio de porcentaje de descuento
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Discoutn enviá un mensaje a Order para actualizar el porcentaje de descuento cuando aun no se procesa la misma.
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "change",
 *        "message": {
 *             "discountId": "{discountId}",
 *             "percentage": "{new percentage for the discount}"
 *        }
 *     }
 */

export async function sendDiscountUpdate(discountId: string, percentage: number): Promise<IRabbitMessage> {
    const message: IRabbitMessage = {
        type: "change",
        message: {
            discountId: discountId,
            percentage: percentage
        }
    };

    return RabbitDirectEmitter.getEmitter("order", "order").send(message);
}