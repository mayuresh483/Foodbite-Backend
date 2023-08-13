import express from 'express';
import cors from 'cors';
import { sample_foods, sample_tags } from './data';

const app = express();
const port = 8080;

app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.get("/api/foods",(req,res)=>{
    res.send(sample_foods);
});

app.get("/api/foods/search/:searchfood",(req,res)=>{
    const searchfood = req.params.searchfood;
    var food = sample_foods.filter
    (x=>x.name.toLowerCase().includes(searchfood.toLowerCase()));
    res.send(food);
});

app.get("/api/tags",(req,res)=>{
    res.send(sample_tags);
});

app.get("/api/tags/:searchTag",(req,res)=>{
    const tag = req.params.searchTag;
    var food = sample_foods.filter(food=>food.tags.includes(tag));
    res.send(food);
})

app.get('/api/foods/:foodId',(req,res)=>{
    const foodid = req.params.foodId;
    var food = sample_foods.filter
    (x=>x.id.toLowerCase().includes(foodid.toLowerCase()));
    res.send(food);
});


app.listen(port,()=>{
    console.log("App listening on port :"+port);
});

