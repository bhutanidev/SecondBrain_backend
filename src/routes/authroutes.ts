import express from "express"
import { userModel } from "../models"
import { comparePassword, hashPassword } from "../helper/encrypthelper"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import cookieParser from "cookie-parser"




const authRouter = express.Router()

authRouter.use(express.json())

authRouter.post("/api/v1/signup",async(req:express.Request,res:express.Response)=>{
    const username:string = req.body.username
    const passsword:string = req.body.password
    try {
        const found = await userModel.findOne({
            username:username,
        })
        if(!found){
            //register
            const hashed = await hashPassword(passsword);
            const newuser = await userModel.create({
                username:username,
                password:hashed
            })
            
            res.status(200).json({success:"user created"})
        }else{
            //user already exists
            res.status(409).json({error:"User already exists"})
        }

    } catch (error) {
        res.status(500).json({error:error})
    }
})
authRouter.use(cookieParser()).post("/api/v1/signin",async(req,res)=>{

    const username = req.body.username
    const password = req.body.password

    const found = await userModel.findOne({username});
    if(!found){
        res.json({error:"User doesnt exist"})
    }else{
        const match = await comparePassword(password,found.password)
        if(match){
            //return cookie
            const key : string = process.env.JWT_SECRET as string
            const token = await jwt.sign({username:found.username,id:found._id},key,{})
            res.cookie("token",token,{
                httpOnly:false
            }).json({username:found.username,token:token})
        }else{
            //error pass not match
            res.json({error:"Password doesnt match"})
        }
    }
    
})

export default authRouter