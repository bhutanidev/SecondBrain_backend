import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);
const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
export const generateEmbeddigs=async(text : string)=>{
    
    const result = await model.embedContent(text);
    return (result.embedding.values);
    
}

// => [0.04574034, 0.038084425, -0.00916391, ...]