import mongoose, { model, Schema } from "mongoose"

interface User{
    username:string,
    password:string
}

// interface Content{
//     link:string,
//     type:string,
//     tags:[mongoose.Schema.Types.ObjectId],
//     title:string,
//     userId:mongoose.Schema.Types.ObjectId
// }

const userSchema = new Schema<User>({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

const contentSchema = new Schema({
    link:String,
    type:String,
    description:String,
    tags:[mongoose.Schema.Types.ObjectId],
    title:String,
    userId:mongoose.Schema.Types.ObjectId,
    embedding:{type:[Number]}
})

const tagSchema = new Schema({
    tag:{type:String}
})

const linkSchema = new Schema({
    hash:{type:String,unique:true},
    userId:mongoose.Schema.Types.ObjectId
})


export const userModel = model("Users",userSchema)
export const contentModel = model("Content",contentSchema)
export const tagModel = model("Tags",tagSchema)
export const linkModel = model("Link",linkSchema)




