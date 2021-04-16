// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { signAccessToken, signRefreshToken } from "../../Utils/Token_helper";
import { serialize } from 'cookie';
import nextConnect from "next-connect";
import { Prisma } from '@prisma/client'
import prisma from '../../Utils/db'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.post(async (req, res) => {
  const s = new Date().getTime()

  const HashedPassword = bcrypt.hashSync(req.body.Password, 12)

  try {
    const { id } = await prisma.users.create({
      data: {
        username: req.body.Name,
        password: HashedPassword,
        email: req.body.email
      }
    })
    const Rtoken = await signRefreshToken({ id })
    const Atoken = await signAccessToken({ id })
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
    console.log("it took", new Date().getTime() - s,"ms to Sign up");
    return res.status(201).send({ Message: "Account has been created successfully" })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return res.status(400).send({ Error: 'Email Already in user' })
    }
    console.log(error);
    return res.status(500).send({ Error: "Something Wrong Happened Please try Again Later" })
  }


})
export default handler
