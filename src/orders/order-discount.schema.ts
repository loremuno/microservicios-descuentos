import * as mongoose from 'mongoose';

export const OrderDiscountSchema = new mongoose.Schema({
    created: Date,
    modified: Date,
    discountId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: String,
});