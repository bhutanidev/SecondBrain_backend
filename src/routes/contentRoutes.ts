import express from "express"
import { attachUser } from "../middleware/authMiddleware"
import { contentModel, userModel } from "../models"
import { generateEmbeddigs } from "../helper/embeddings"
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const contentRouter = express.Router()

contentRouter.post("/api/v1/content",attachUser,async(req,res)=>{

    const {link,type,title,description}:{link:string,type:string,title:string,description:string} = req.body
    const userId = req.userId

    const embedding = await generateEmbeddigs(description)

    const newcontent  = await contentModel.create({
        link:link,
        description:description,
        title:title,
        type:type,
        userId:userId,
        embedding
    })

    // res.json({newcontent.link,newcontent.title})
    // const data = {}
    // const populated = await newcontent.populate("userId","username")

    res.json({
        link,title,type,id:newcontent._id,description
    })

    
})

contentRouter.get("/api/v1/content",attachUser,async(req,res)=>{
    const userId = req.userId
    const content = await contentModel.find({
        userId:userId
    }).select('link type title _id description')
    const transformedContent = content.map((item) => ({
        id: item._id,
        link: item.link,
        type: item.type,
        title: item.title,
        description:item.description
        // userId: item.userId,
    }));

    res.send(transformedContent);
})
contentRouter.post("/api/v1/query",attachUser,async(req,res)=>{
    const {query}=req.body
    const queryEmbeddings =await  generateEmbeddigs(query)
    try {
        const pipeline =[
            {
              "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector":queryEmbeddings,
                "numCandidates": 15,
                "limit": 5
              },
            },
            {
              $project: {
                _id: 0, // Exclude _id from results
                description: 1, // Include the 'text' field in results
                 // Include metadata
              },
            },
          ]
          const results = await contentModel.aggregate(pipeline);
          console.log(results);
          const prompt = `I have the following knowledge:
          ${JSON.stringify(results)} and perform the followig task:
          1.Summarize what i know
          2.Give detailed response about ${query}
          `
          const result = await model.generateContent(prompt);
          const rep = result.response.text()
        //   const result = await model.generateContent(prompt);
        res.json({result : rep})
          
    } catch (error) {
        
    }
})
contentRouter.delete("/api/v1/content",attachUser,async(req,res)=>{
    const {postId} = req.body
try {
        const deletedContent = await contentModel.findByIdAndDelete(postId)
        res.json({success:"deleted content"})
} catch (error) {
    res.json({error:"Not able to delete data"})
}
})