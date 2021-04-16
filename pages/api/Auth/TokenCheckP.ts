import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie";
import { signAccessToken, VerifyAccessToken, VerifyRefrechToken } from "../../../Utils/Token_helper";
import nextConnect from "next-connect";
import prisma  from "../../../Utils/db";


const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.post(async (req, res) => {
    const s = new Date().getTime()
    const cookie = req.cookies
    // console.log(req.socket.remoteAddress);

    if (!cookie.Rtoken) {
        console.log("no cookies",new Date().getTime() - s);
        return res.status(401).send({ UserStatus: "UnAuthorized" })
    }
    try {        
        if (!cookie.Atoken) {
            const data = await VerifyAccessToken(cookie.Atoken)
            const {id} = await prisma.users.findUnique({
                where:{
                    id:data.id.toString()
                }
            }) 
            console.log(new Date().getTime() - s);
            if (!id) throw new Error("Invalid user");
            return res.status(200).send({ UserStatus: "Authorized" })
        }
        throw new Error('No Atoken')

    } catch (error) {

        const data = await VerifyRefrechToken(cookie.Rtoken)
        const {id} = await prisma.users.findUnique({
            where:{
                id:data.id.toString()
            }
        }).catch((err)=> {return {id:undefined}})
        if (!id) return res.status(401).send({ UserStatus: "UnAuthorized" })
        const NewAccessToken = await signAccessToken({ id })
        res.setHeader("Set-Cookie", serialize("Atoken", NewAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60,
            sameSite: "strict",
            path: "/"
        }))
        console.log(new Date().getTime() - s);
        return res.status(200).send({ UserStatus: "Authorized" })
    }

})

export default handler
