import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next'
dotenv.config({ path: "../../.env" })
import nextConnect from 'next-connect'
import GetIdFromToken from '../Auth/GetIdFromToken';
import pool from '../../../Utils/DBConnectPG'

interface ExtentedRequest extends NextApiRequest {
    id:String
}
const handler = nextConnect<ExtentedRequest, NextApiResponse>()
.use(GetIdFromToken)

handler.post((req, res) => {
    const checkConV = `SELECT conversation_id FROM participants
    WHERE user_id = $1
    INTERSECT
    SELECT conversation_id FROM participants 
    WHERE user_id = $2;`
    const createconv = `INSERT INTO conversation DEFAULT VALUES RETURNING conversation_id;`
    pool.query(checkConV, [req.id,req.body.ReceiverId])
        .then(async (result) => {            
            let convid                  
            if (result.rowCount === 0) {
                convid = (await pool.query(createconv)).rows[0].conversation_id
                await pool.query(`INSERT INTO participants(conversation_id,user_id) 
                VALUES($1::uuid,$2::uuid),
                ($1::uuid,$3::uuid);`,[convid,req.id,req.body.ReceiverId])                
            }
            else {                
                convid = result.rows[0].conversation_id
            }                        
            return res.status(200).send({ConvId:convid,Id:req.id})
        })
        .catch((err) => {
            console.error(err);
        })

})
export default handler;