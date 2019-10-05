export interface Discount {
    _id: String;
    discountId: String;
    created: Date;
    modified: Date;
    percentage: number;
    redeemed: boolean;
    endLife: Date;
    status: string;
}