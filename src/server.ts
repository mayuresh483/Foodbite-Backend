import express from 'express';
import cors from 'cors';
import { sample_foods, sample_tags, sample_users } from './data';
import jwt from "jsonwebtoken";

const app = express();
const port = 8080;

app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.use(express.json());

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
    var food = tag.includes('All')? sample_foods : sample_foods.filter(food=>food.tags.includes(tag));
    res.send(food);
})

app.get('/api/foods/:foodId',(req,res)=>{
    const foodid = req.params.foodId;
    var food = sample_foods.find
    (x=>x.id.toLowerCase().includes(foodid.toLowerCase()));
    res.send(food);
});

app.post('/api/users/auth',(req,res)=>{
    const {email, password} = req.body;
    const user = sample_users.find(user=>user.email == email && user.password == password);
    if(user){
        res.send(generateTokenResponse(user));
    }else{
        res.status(400).send("User name or password is not valid");
    }
});

const generateTokenResponse = (user:any)=>{
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    },"HeyBuddy",{
        expiresIn:'2d'
    });

    user.token = token;
    return user;
}


app.listen(port,()=>{
    console.log("App listening on port :"+port);
});

