import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const __dirname = path.resolve();
import {client} from "../../db/mongodb.mjs"
const db = client.db("institudemanagment")
const usercol = db.collection("users")
const SECRET = process.env.SECRET || "topsecret";


router.get("/userchecking", async(req,res,next)=>{

    if(req.cookies.token){

        const data = jwt.decode(req.cookies.token , SECRET)
        const user = await usercol.findOne({ email: data.email});
        console.log(user)
        res.status(200).send(user)
        return;
    }

    res.status(401).send("not login")
})

export default router