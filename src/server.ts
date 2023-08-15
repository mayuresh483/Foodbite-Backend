import express from 'express';
import cors from 'cors';
import FoodRouter from './router/food.router';
import UserRoute from './router/user.router';
import dotenv from 'dotenv';
import { dbConnect } from './config/database.config';

const app = express();
const port = 8080;
dotenv.config();
dbConnect();
// process.env.MONGO_URI;

app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.use(express.json());

app.use("/api/foods",FoodRouter);
app.use('/api/users',UserRoute);

app.listen(port,()=>{
    console.log("App listening on port :"+port);
});

