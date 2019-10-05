import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Discount } from './discount.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { status } from './discounts.status';

@Injectable()
export class DiscountsService {
    constructor(@InjectModel('Discount') private readonly discountModel: Model<Discount>) { }

    create(discount: Discount): Observable<Discount> {
        return new Observable<Discount>((observer) => {
            discount.created = new Date();
            discount.modified = new Date();
            discount.status = status.active;
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

    update(id, discount: Discount): Observable<any> {
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
                        observer.error(new HttpException("No se puede actualizar un descuento ya reclamado", HttpStatus.INTERNAL_SERVER_ERROR));
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
