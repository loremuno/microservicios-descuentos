import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OrderDiscount } from './order-discount.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class OrdersService {
    constructor(@InjectModel('OrderDiscount') private readonly orderDiscountModel: Model<OrderDiscount>) { }

    redeem(orderId, discount): Observable<any> {
        return new Observable<any>((observer) => {
            this.orderDiscountModel.findOne({ 'orderId': orderId }).then(
                (doc) => {
                    if (doc) {
                        observer.error(new HttpException("La orden de compra ya tiene un descuento aplicado", HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                    else {
                        this.orderDiscountModel.findOne({ 'discountId': discount.discountId }).then(
                            (doc) => {
                                if (doc) {
                                    observer.error(new HttpException("El codigo de descuento ya ha sido usado", HttpStatus.INTERNAL_SERVER_ERROR));
                                }
                                else {
                                    let orderDiscount = {
                                        discountId: discount.discountId,
                                        orderId: orderId,
                                        created: new Date(),
                                        modified: new Date(),
                                    }
                                    const createdOrderDiscount = new this.orderDiscountModel(orderDiscount);
                                    createdOrderDiscount.save().then(
                                        (data) => {
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
        })
    }
}
