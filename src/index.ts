import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import jwt from "jsonwebtoken"
import {connectmongo} from "./db"
import authRouter from "./routes/authroutes"
import { contentRouter } from "./routes/contentRoutes"
import { contentModel, linkModel } from "./models"
import crypto from "crypto"
import { attachUser } from "./middleware/authMiddleware"
import cookieParser from "cookie-parser"
import cors from "cors"
import { generateEmbeddigs } from "./helper/embeddings"

//npm i -D means dev depenedncy -> used only for development not in production
const app = express()
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true, 
};
app.use(cors(options));

connectmongo()

app.use(express.json())
app.use(cookieParser())
app.use("/",authRouter)

app.use("/",contentRouter)

app.post("/api/v1/brain/share",attachUser,async(req,res)=>{
    const userId = req.userId
    
    const find = await linkModel.findOne({
        userId:userId
    })
    
    if(!find){
        const hash = crypto.randomBytes(16).toString('hex')
        const newlink = await linkModel.create({
            userId:userId,
            hash:hash
        })
        res.json({
            uniquecode:newlink.hash
        })
    }else{
        res.json({
            userId:find.userId,
            uniquecode:find.hash
        })
    }

})

app.get("/api/v1/brain/:brainId",async(req,res)=>{

    const brainId = req.params.brainId
    console.log(req.params);
    
    console.log(brainId);
    

    const find = await linkModel.findOne({
        hash:brainId
    })

    
    
    if(!find){
        res.json({
            error:"Not Available"
        })
    }else{
        const id = find.userId
        // console.log(find.userId)
        const content = await contentModel.find({
            userId:id
        }).select("_id link type description title")
        const transformedContent = content.map((item) => ({
            id: item._id,
            link: item.link,
            type: item.type,
            title: item.title,
            description:item.description
            // userId: item.userId,
        }));
    
        res.send(transformedContent);
    }
    
})

// const text = "A robot may not injure a human being or, through inaction, allow a human being to come to harm."
// generateEmbeddigs(text)
app.listen(8000)
