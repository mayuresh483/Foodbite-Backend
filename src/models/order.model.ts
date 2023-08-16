import { Schema, Types ,model} from "mongoose";
import { Food, FoodSchema } from "./food.model";

export enum OrderStatus{
    NEW = 'NEW',
    PAYED = 'PAYED',
    SHIPPED = 'SHIPPED',
    CANCELED = 'CANCELED',
    REFUNDED = 'REFUNDED'
}

export interface OrderItem{
    food:Food;
    price:number;
    quantity:number;
}

export interface LatLng{
    lat:string;
    lng:string;
}

export interface Order{
    id:string;
    items:OrderItem[];
    totalPrice:number;
    name:string;
    address:string;
    addressLatLang:LatLng;
    paymentId:string;
    createdAt:Date;
    updatedAt:Date;
    user: Types.ObjectId;
    status:OrderStatus;
}

export const LatLngSchema = new Schema<LatLng>({
    lat:{type:String, required:true},
    lng:{type:String, required:true}
});

export const OrderItemSchema = new Schema<OrderItem>({
    food:{type:FoodSchema, required:true},
    price:{type:Number, required:true},
    quantity:{type:Number,required:true}
})

export const OrderSchema = new Schema<Order>({
    name:{type:String,required:true},
    items:{type:[OrderItemSchema], required:true},
    totalPrice:{type:Number, required:true},
    address:{type:String, required:true},
    addressLatLang:{type:LatLngSchema, required:true},
    paymentId:{type:String},
    user: {type:Schema.ObjectId,required:true},
    status:{type:String,default:OrderStatus.NEW}
},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
}) 

export const OrderModel = model('order',OrderSchema);