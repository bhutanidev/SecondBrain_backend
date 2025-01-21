import { NextFunction , Request,Response } from "express"
import jwt from "jsonwebtoken"


export const attachUser = async(req:Request,res:Response,next: NextFunction)=>{

    try {
        const header = req.headers['authorization']
        const token = header?.split(" ")[1] as string
        if(!token){
            res.json({error:"No token found"})
            return
        }
        const key :string = process.env.JWT_SECRET as string
    
        const decoded = await jwt.verify(token,key)
    
        if(decoded && typeof decoded === 'object'){
            req.userId = decoded.id
            next()
            return
        }else{
            res.status(403).json({error:"Not logged in or invalid token"})
        }
    } catch (error) {
        console.error(error)
        res.status(401).json({error:"Invalid token"})
    }

}