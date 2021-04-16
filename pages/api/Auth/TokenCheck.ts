import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie";
import { signAccessToken, VerifyAccessToken, VerifyRefrechToken } from "../../../Utils/Token_helper";
import pool from '../../../Utils/DBConnectPG'
import nextConnect from "next-connect";

interface ExtentedRequest extends NextApiRequest {
    id:String
  }

const handler = nextConnect<ExtentedRequest, NextApiResponse>()
handler.post(async (req, res) => {
    const s = new Date().getTime()
    const cookie = req.cookies
    const bd = pool;
    // console.log(req.socket.remoteAddress);

    if (!cookie.Rtoken) {
        console.log("no cookies",new Date().getTime() - s);
        return res.status(401).send({ UserStatus: "UnAuthorized" })
    }
    try {
        if (!cookie.Atoken) {
            const { id } = await VerifyAccessToken(cookie.Atoken)
            const result = await bd.query("SELECT * FROM users Where Id = $1::uuid", [id])
            if (result.rowCount === 0) throw new Error("Invalid user");
            req.id = id
            console.log(new Date().getTime() - s);
            return res.status(200).send({ UserStatus: "Authorized" })
        }
        throw new Error('No Atoken')

    } catch (error) {

        const { id } = await VerifyRefrechToken(cookie.Rtoken)
        const result = await bd.query("SELECT * FROM users Where Id = $1::uuid", [id])

        if (result.rowCount === 0) return res.status(401).send({ UserStatus: "UnAuthorized" })
        const NewAccessToken = await signAccessToken({ id })
        res.setHeader("Set-Cookie", serialize("Atoken", NewAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60,
            sameSite: "strict",
            path: "/"
        }))
        req.id = id
        console.log(new Date().getTime() - s);

        return res.status(200).send({ UserStatus: "Authorized" })
    }

})

export default handler
