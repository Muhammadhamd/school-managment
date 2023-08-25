import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
const __dirname = path.resolve()

router.get("/dashboard", (req ,res ,next)=>{
    
    if(!req.cookies.token){
        res.redirect("/")
        return;
    }
res.sendFile(path.join(__dirname , "public/dashboard.html"))


})




export default router