import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../Utils/db'
dotenv.config({ path: "../../.env" })
import nextConnect from 'next-connect'
import GetIdFromToken from '../Auth/GetIdFromToken';
interface ExtentedRequest extends NextApiRequest {
    id: String
}
const handler = nextConnect<ExtentedRequest, NextApiResponse>()
    .use(GetIdFromToken)

handler.post(async (req, res) => {
    console.log("Sending:",req.body.Message);
    
    try {
        const s = new Date().getTime()
        const participants = await prisma.participants.findMany({
            where: {
                user_id: req.id.toString(),
                conversation_id: req.body.Convid
            },
        })
        if (!participants) return res.status(401).send({ Error: 'UnAuthorized Conversation' })
        await prisma.messages.create({
            data: {
                content: req.body.Message,
                user_id: req.id.toString(),
                conversation_id: req.body.Convid
            }
        })
        console.log("PG to send msg in ms", new Date().getTime() - s);
        return res.status(200)
    } catch (error) {
        console.log(error);
        
    }


})
export default handler;