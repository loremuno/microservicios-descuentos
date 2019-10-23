import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { OrderDiscount } from './order-discount.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { DiscountsService } from '../discounts/discounts.service'
import { RabbitMQClient } from '../rabbit/rabbitmq-client';
import * as Amqp from "amqp-ts";

var connection = new Amqp.Connection("amqp://localhost");
var exchange = connection.declareExchange("discount_redeem", 'fanout');
var queue = connection.declareQueue("QueueName");
queue.bind(exchange);
queue.activateConsumer((message) => {
    console.log("Message received: " + message.getContent());
});

@Injectable()
export class OrderDiscountService {
    client: any;
    constructor(
        private readonly httpService: HttpService,
        private DiscountsService: DiscountsService,
        @InjectModel('OrderDiscount') private readonly orderDiscountModel: Model<OrderDiscount>
    ) { }

    redeem(discountId, order): Observable<any> {
        return new Observable<any>((observer) => {
            this.httpService.get(`http://localhost:3002/v1/orders/${order.orderId}`,
                { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ5N2NjZjY5OGE4ZmEzMjM0YjFiYzQ3IiwidG9rZW5faWQiOiI1ZGIwZGZmNGQ1MTI0ZDc4ODA0ZGI5OTciLCJpYXQiOjE1NzE4NzI3NTZ9.Lw59iUtCk-shZQzivh7etnCMHlia0zb8bOSNaECoBW0' } })
                .subscribe(
                    (data) => {
                    console.log("TCL: OrderDiscountService -> data", data)

                        this.orderDiscountModel.findOne({ 'orderId': order.orderId }).then(
                            (doc) => {
                                if (doc) {
                                    observer.error(new HttpException("La orden de compra ya tiene un descuento aplicado", HttpStatus.CONFLICT));
                                }
                                else {
                                    this.orderDiscountModel.findOne({ 'discountId': discountId }).then(
                                        (doc) => {
                                            if (doc) {
                                                observer.error(new HttpException("El codigo de descuento ya ha sido usado", HttpStatus.CONFLICT));
                                            }
                                            else {
                                                let orderDiscount = {
                                                    discountId: discountId,
                                                    orderId: order.orderId,
                                                    created: new Date(),
                                                    modified: new Date(),
                                                }
                                                const createdOrderDiscount = new this.orderDiscountModel(orderDiscount);
                                                createdOrderDiscount.save().then(
                                                    (data) => {
                                                        this.DiscountsService.findById(discountId).then(
                                                            async (dataDiscount) => {
                                                                // this.client = new RabbitMQClient('amqp://localhost', 'example');
                                                                // this.client.sendSingleMessage({
                                                                //     "discountId": discountId,
                                                                //     "percentage": dataDiscount.percentage,
                                                                //     "redeemed": dataDiscount.redeemed,
                                                                //     "status": dataDiscount.status,
                                                                //     "endLife": dataDiscount.endLife,
                                                                // })
                                                                var msg = new Amqp.Message({
                                                                    "discountId": discountId,
                                                                    "percentage": dataDiscount.percentage,
                                                                    "redeemed": dataDiscount.redeemed,
                                                                    "status": dataDiscount.status,
                                                                    "endLife": dataDiscount.endLife,
                                                                });
                                                                exchange.send(msg);
                                                                // await this.amqp.createChannel((err, channel) => {
                                                                //     if (err != null) {
                                                                //         console.log("TCL: OrderDiscountService -> err", err)
                                                                //     }
                                                                //     channel.assertQueue('set_discount_data');
                                                                //     channel.sendToQueue('set_discount_data',
                                                                //         {
                                                                //             "discountId": discountId,
                                                                //             "percentage": dataDiscount.percentage,
                                                                //             "redeemed": dataDiscount.redeemed,
                                                                //             "status": dataDiscount.status,
                                                                //             "endLife": dataDiscount.endLife,
                                                                //         }
                                                                //     );
                                                                // });
                                                            }
                                                        )
                                                        observer.next({
                                                            discountId: data.discountId,
                                                            orderId: data.orderId,
                                                        });
                                                        observer.complete();
                                                    }
                                                )
                                                    .catch(
                                                        (error) => {
                                                            observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                                                        }
                                                    )
                                            }
                                        }
                                    ).catch(
                                        (error) => {
                                            observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                                        }
                                    )
                                }
                            }
                        ).catch(
                            (error) => {
                                observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                            }
                        )
                    },
                    (error) => {
                        console.log("TCL: OrderDiscountService -> error", error)
                        if(error.response.status == 401){
                            observer.error(new HttpException(error.response.statusText, HttpStatus.UNAUTHORIZED));
                        }
                        else if(error.response.status == 404){
                            observer.error(new HttpException('No existe la orden de compra ingresada', HttpStatus.CONFLICT));
                        }
                    }
                );

        })
    }
}
