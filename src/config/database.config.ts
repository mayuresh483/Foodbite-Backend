import { connect,ConnectOptions } from 'mongoose';

export const dbConnect =() => {
    connect(process.env.MONGO_URI!,{
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    } as ConnectOptions).then(
        ()=> console.log("Connected Successfully"),
        (err)=> console.log(err)   
    )   
}