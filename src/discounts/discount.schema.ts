import * as mongoose from 'mongoose';

export const DiscountSchema = new mongoose.Schema({
    created: Date,
    modified: Date,
    percentage: {
        type: Number,
        required: true,
    },
    redeemed: {
        type: Boolean,
        required: true,
    },
    endLife: {
        type: Date,
        required: true,
    },
    status: String,
});