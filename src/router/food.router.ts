import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';

const router = Router();

router.get("/seed",asyncHandler(
    async(req,res)=>{
        const foodCount = await FoodModel.countDocuments(); 
        if(foodCount>0){
            res.send("Seeding is already done");
            return
        }

        await FoodModel.create(sample_foods);
        res.send("Done Seeding");
    }
)
);

router.get("/tags",asyncHandler(
    async(req,res)=>{
        const tag = await FoodModel.aggregate([
            {
                $unwind:'$tags'
            },
            {
                $group:{
                    _id:'$tags',
                    count:{$sum:1}
                }
            },
            {
                $project:{
                    _id:0,
                    name:"$_id",
                    count:"$count"
                }
            }
        ]).sort({count:-1});

        const all = {
            name:"All",
            count: await FoodModel.countDocuments()
        }

        tag.unshift(all);
        res.send(tag);
    }
));

router.get('/:foodId',asyncHandler(
    async(req,res)=>{
        const foodid = req.params.foodId;
        const food = await FoodModel.findById(foodid);
        res.send(food);
    }
));

router.get("/search/:searchfood",asyncHandler(
    async(req,res)=>{
        const searchRegex = new RegExp(req.params.searchfood,'i');
        const food = await FoodModel.find({name:{$regex:searchRegex}});
        res.send(food);
    }
));

router.get("/tags/:searchTag", asyncHandler(
    async(req,res)=>{
        const searchTag = req.params.searchTag;
        let food = await FoodModel.find();
        if(searchTag!="All"){
            food = await FoodModel.find({tags: searchTag});
        }
        res.send(food);
    }
));

router.get("/", asyncHandler(
    async(req,res)=>{
        const foods = await FoodModel.find()
        res.send(foods);
    } 
));

export default router;