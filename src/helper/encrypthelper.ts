import bcrypt from "bcrypt"

export const hashPassword = async(password:string)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(12,(err,salt)=>{
            if(err){
                reject(err)
            }
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

export const comparePassword = async(password:string,hashed:string)=>{
    return bcrypt.compare(password,hashed)
}
