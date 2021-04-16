import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../Utils/DBConnectPG'
dotenv.config({ path: "../../.env" })
import nextConnect from 'next-connect'
import { Pool } from 'pg';
import GetIdFromToken from '../Auth/GetIdFromToken';
interface ExtentedRequest extends NextApiRequest {
    id: String
}
const handler = nextConnect<ExtentedRequest, NextApiResponse>()
    .use(GetIdFromToken)

handler.post((req, res) => {
    const s = new Date().getTime()
    const checkConV = `SELECT conversation_id FROM participants
    WHERE user_id = $1 And conversation_id = $2;`
    const insertmsg = 'INSERT INTO messages(content,user_id,conversation_id) VALUES($1,$2::uuid,$3::uuid) RETURNING id;'
    pool.query(checkConV, [req.id, req.body.Convid])
        .then(async (result) => {
            if (result.rowCount === 0) {
                return res.status(401).send({ Error: 'UnAuthorized Conversation' })
            }
            else {
                await pool.query(insertmsg, [req.body.Message, req.id, req.body.Convid])
                return res.status(200).send({Message:'Message Sent'})
            }
        })
        .catch((err) => {
            console.error(err);
        })
    console.log("PG to send msg in ms",new Date().getTime() - s);
    
})
export default handler;