import nc from "next-connect";
import DbConnect from '../../Utils/DBConnectPG'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get((req, res) => {
      res.status(400)
    res.send("Hello world");
  })
  .post((req, res) => {
    res.json({ hello: "world" });
  })
  .put(async (req, res) => {
    res.end("async/await is also supported!");
  })
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });

export default handler;