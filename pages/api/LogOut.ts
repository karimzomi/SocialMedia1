import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import nextConnect from 'next-connect'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
const s = new Date()
s.setFullYear(1999,4,14)
handler.post((req, res) => {
    res.setHeader("Set-Cookie",serialize("Atoken","",{
        expires:s,
        path:"/"
    }))
    res.setHeader("Set-Cookie",serialize("Rtoken","",{
        expires:s,
        path:"/"

    }))
    res.status(200).send({})
})
export default handler;