import { NextApiRequest, NextApiResponse } from 'next'
import nextconnect from 'next-connect';
import prisma from '../../Utils/db'
// import pool from './Utils/DBConnectPG'

const handler = nextconnect<NextApiRequest, NextApiResponse>()

handler.get(async(req, res) => {
    const users = await prisma.users.findMany({
        select:{
            id:true,
            username:true
        },
        orderBy:{create_at:'asc'},
        take:2,
    })
    console.log(users);
    
    res.status(200).send(users)
    // pool.query("Select * from Users")
    //     .then((table) => {
    //         const result = table.rows.map((user) => {                
    //             return{
    //                 id:user.id,
    //                 username:user.username
    //             }
    //         })

    //         res.status(200).send(result)

    //     })
    
})

export default handler;
