import mongoose, { model, Schema } from "mongoose"
import 'dotenv/config'

export const connectmongo = async()=>{
    mongoose.connect(process.env.MONGO_URL||"")
    .then(()=>{
        console.log('db connected');
    })
    .catch((error)=>{
        console.log(error);
    })
}

