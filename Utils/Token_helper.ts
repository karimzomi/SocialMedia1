import  jwt from "jsonwebtoken";

const Refrech_Key = process.env.JWT_Refrech
const Access_Key = process.env.JWT_Access


export const signAccessToken = (UserId)=>{    
    return new Promise<string>((resolve, reject) => {
        const options:jwt.SignOptions = {
            expiresIn:60
        }   
        jwt.sign(UserId,Access_Key,options,(err,token)=>{
            if(err)reject(err)
            resolve(token)
        })
    })
    
}
export const signRefreshToken = (UserId)=>{
    return new Promise<string>((resolve, reject) => {
        const options:jwt.SignOptions = {
            expiresIn:'1y'
        }   
        jwt.sign(UserId,Refrech_Key,options,(err,token)=>{
            if(err)reject(err)
            resolve(token)
        })
    })
    
}
interface My{
    id:String
}
export const VerifyAccessToken = (token)=>{
    return new Promise<My>((resolve, reject) => { 
        jwt.verify(token,Access_Key,(err,decoded)=>{
            if(err) reject(err)
            resolve(decoded)
        })
    })

}
export const VerifyRefrechToken = (token)=>{
    return new Promise<My>((resolve, reject) => { 
        jwt.verify(token,Refrech_Key,(err,decoded)=>{
            if(err) reject(err)            
            resolve(decoded)
        })
    })

}