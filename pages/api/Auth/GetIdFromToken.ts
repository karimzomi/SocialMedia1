import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie";
import { signAccessToken, VerifyAccessToken,VerifyRefrechToken } from "../../../Utils/Token_helper";
import pool from '../../../Utils/DBConnectPG'
import  nextConnect from "next-connect";

interface ExtentedRequest extends NextApiRequest {
  id:String
}

const handler = nextConnect<ExtentedRequest, NextApiResponse>()
handler.post(async (req, res,next) => {    
    const cookie = req.cookies
    if(!cookie.Rtoken){        
        return res.status(401).send({UserStatus:"UnAuthorized"}) 
    }
    try {        
        const {id} = await VerifyAccessToken(cookie.Atoken)                
        const result = await pool.query("SELECT * FROM users Where Id = $1::uuid",[id])
        if(result.rowCount === 0) throw new Error("Invalid user");
        req.id = id
    } catch (error) {
        const {id} = await VerifyRefrechToken(cookie.Rtoken)        
        const result = await pool.query("SELECT * FROM users Where Id = $1::uuid",[id])
        if(result.rowCount === 0) return res.status(401).send({UserStatus:"UnAuthorized"})        
        req.id = id
    }
  return next();

})

export default handler
