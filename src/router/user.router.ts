import { Router } from 'express';
import jwt from "jsonwebtoken";
import { sample_users } from '../data';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

const router = Router();

router.get("/seed", asyncHandler(
    async(req,res)=>{
        const userCount = await UserModel.countDocuments(); 
        if(userCount>0){
            res.send("Seeding is already done");
            return
        }
        await UserModel.create(sample_users);
        res.send("Done Seeding");
    }
));

const generateTokenResponse = (user:any)=>{
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    },"HeyBuddy",{
        expiresIn:'2d'
    });
    user.token = token;
    return user;
}

router.post('/auth',asyncHandler(
    async(req,res)=>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email,password});
    if(user){
        res.send(generateTokenResponse(user));
        
    }else{
        res.status(400).send("User name or password is not valid");
    }
}));

router.post('/register', asyncHandler(
    async(req,res)=>{
        const {name, email, password, address} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            res.status(400).send("User Already exist, please login!");
            return;
        }
        const encryptPass = await bcrypt.hash(password,10);
        const newUser:User = {
            name,
            email:email.toLowerCase(),
            password:encryptPass,
            address:address,
            isAdmin:false
        }
        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
    }
))



export default router;