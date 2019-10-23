import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Discount } from './discount.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { status } from './discounts.status';
import { sendDiscountUpdate } from '../rabbit/discountService';
import { CreateDiscountDTO } from '../dto/createDiscountDTO';
import { ModifyDiscountDTO } from '../dto/modifyDiscountDTO';
import * as Amqp from "amqp-ts";

var connection = new Amqp.Connection("amqp://localhost");
var exchange = connection.declareExchange("discount_update", 'change');

@Injectable()
export class DiscountsService {
    constructor(
        @InjectModel('Discount') private readonly discountModel: Model<Discount>,
    ) { }

    create(createDiscountDTO: CreateDiscountDTO): Observable<Discount> {
        return new Observable<Discount>((observer) => {
            let discount: Discount = new Discount();
            discount.created = new Date();
            discount.modified = new Date();
            discount.status = status.active;
            discount.redeemed = createDiscountDTO.redeemed;
            discount.percentage = createDiscountDTO.percentage;
            discount.endLife = createDiscountDTO.endLife;
            const createdDiscount = new this.discountModel(discount);
            createdDiscount.save().then(
                (data: Discount) => {
                    observer.next(data);
                    observer.complete();
                }
            )
                .catch(
                    (error) => {
                        observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                )
        })
    }

    update(id, discount: ModifyDiscountDTO): Observable<any> {
        return new Observable<any>((observer) => {
            this.discountModel.findById(id).then(
                (doc) => {
                    if (!doc.redeemed) {
                        doc.percentage = discount.percentage;
                        doc.redeemed = discount.redeemed;
                        doc.endLife = discount.endLife;
                        doc.status = status.active;
                        doc.save().then(
                            (data: Discount) => {
                                var msg = new Amqp.Message({
                                    "discountId": id,
                                    "percentage": data.percentage,
                                });
                                exchange.send(msg);
                                observer.next({
                                    percentage: data.percentage,
                                    redeemed: data.redeemed,
                                    endLife: data.endLife,
                                    modified: data.modified
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
                    else {
                        observer.error(new HttpException("No se puede actualizar un descuento ya reclamado", HttpStatus.CONFLICT));
                    }
                }
            )
                .catch(
                    (error) => {
                        observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                )
        })
    }

    remove(id): Observable<any> {
        return new Observable<any>((observer) => {
            this.discountModel.findById(id).then(
                (doc) => {
                    if (doc.status == status.deleted) {
                        observer.error(new HttpException("Este descuento ya ha sido eliminado", HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                    else {
                        doc.status = status.deleted;
                        doc.save().then(
                            (data: Discount) => {
                                observer.next({
                                    status: data.status,
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
            )
                .catch(
                    (error) => {
                        observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                )
        })
    }


    async findAll(): Promise<Discount[]> {
        return await this.discountModel.find().exec();
    }

    async findById(id): Promise<Discount> {
        return await this.discountModel.findById(id);
    }

    findByParameter(query): Observable<Discount> {
        return new Observable<Discount>((observer) => {
            this.discountModel.find(query).then(
                (doc) => {
                    observer.next(doc);
                    observer.complete();
                }
            ).catch(
                (error) => {
                    observer.error(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
                }
            )
        })
    }
}
