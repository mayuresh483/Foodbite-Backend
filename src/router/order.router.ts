import Router from 'express';
import asyncHandler from 'express-async-handler'; 
import { OrderModel, OrderStatus } from '../models/order.model';
import auth from '../middleware/auth.mid';

const route = Router();

route.use(auth);
route.post('/create',asyncHandler(
    async(req:any,res:any)=>{
        const requestOrder = req.body;

        if(requestOrder.items.length <= 0){
            res.status(400).send('Cart is Empty');
            return;
        }

        await OrderModel.deleteOne({
            user: req.user.id,
            status:OrderStatus.NEW
        });

        const newOrder = new OrderModel({...requestOrder,user:req.user.id})
        await newOrder.save();
        res.send(newOrder);
}));

route.get('/currentOrder', asyncHandler(
    async(req:any,res:any)=>{
       const order = await OrderModel.findOne({user:req.user.id,status:OrderStatus.NEW}); 
        if(order)
       res.send(order);
        else res.status(400).send();
    }
));

route.get('/pay', asyncHandler(
    async(req:any,res:any)=>{
        const {paymentId} = req.body;
        const order = await OrderModel.findOne({user:req.user.id,status:OrderStatus.NEW}); 
        if(!order){
            res.send(order);
            return;
        }

        order.paymentId = paymentId;
        order.status = OrderStatus.PAYED;
        await order.save();

        res.send(order._id);
    }
))

export default route;