import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";

/**
 * @api {direct} catalog/article-exist Comprobar Articulo
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Cart enviá un mensaje a Catalog para comprobar la validez de un articulo.
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "article-exist",
 *        "queue": "cart",
 *        "exchange": "cart",
 *         "message": {
 *             "referenceId": "{cartId}",
 *             "articleId": "{articleId}"
 *        }
 *     }
 */
/**
 * Enviá una petición a catalog para validar si un articulo puede incluirse en el cart.
 */
export async function sendArticleValidation(cartId: string, articleId: string): Promise<IRabbitMessage> {
    const message: IRabbitMessage = {
        type: "article-exist",
        exchange: "cart",
        queue: "cart",
        message: {
            referenceId: cartId,
            articleId: articleId
        }
    };

    return RabbitDirectEmitter.getEmitter("catalog", "catalog").send(message);
}