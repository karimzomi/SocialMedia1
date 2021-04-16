import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next'
dotenv.config({ path: "../../.env" })
import pool from '../../../Utils/DBConnectPG'
import nextConnect from 'next-connect'
import prisma from '../../../Utils/db';
const handler = nextConnect()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * @author Karim Zomita
     */
    const s = new Date().getTime()
    try {
        const sq = `SELECT * FROM(
            SELECT user_id,content,created_at,id FROM messages 
            WHERE conversation_id = $1::uuid
            ORDER BY created_at desc
            LIMIT ${10})messages
            ORDER BY created_at asc;
            `
        const data = await pool.query(sq, [req.query.getChat])
        console.log("Getting Messages->", new Date().getTime() - s, "ms Pool clients->", pool.totalCount);
        res.send(data.rows)
        
    } catch (error) {
        console.log(error);
    }
    /**
     * An example that uses ``Prisma` for getting the messsages
     *  const messages = await prisma.messages.findMany({
        select:{
            user_id:true,
            content:true,
            created_at:true,
            id:true
        },
        where:{
            conversation_id:req.query.getChat.toString()
        },
        orderBy:{created_at:'asc'},
        take:10
    })
    res.send(messages)
    console.log("Getting Messages->", new Date().getTime() - s, "ms Pool clients->", pool.totalCount);
     */
})
export default handler;