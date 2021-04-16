// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { serialize } from 'cookie'
import { signAccessToken, signRefreshToken } from "../../Utils/Token_helper";
import nextConnect from "next-connect";
import prisma from '../../Utils/db'
import { Prisma } from '@prisma/client';



const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.post(async(req, res) => {

  try {
    const {id,password} = await prisma.users.findUnique({
      where: {
        email:req.body.email
      }
    })
    if(bcrypt.compareSync(req.body.Password, password)){
      const Rtoken = await signRefreshToken({id})
      const Atoken = await signAccessToken({id})
      res.setHeader("Set-Cookie", [serialize("Atoken", Atoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60,
        sameSite: "strict",
        path: "/"
      }), serialize("Rtoken", Rtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        path: "/"
      })])
      return res.status(201).send({ Message: "Account Loged In successfully" })
    }
    return res.status(401).send({Message:"Wrong Password Or Email"})
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {      
      if (error.code === 'P2002') return res.status(400).send({ Error: 'Email Already in user' })
    }
    return res.status(500).send({ Error: "Something Wrong Happened Please try Again Later" })
  }
})
export default handler
