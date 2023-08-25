import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const __dirname = path.resolve();
const SECRET = process.env.SECRET || "topsecret";

const studentSchema = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
        // unique:true
    },
   
    Address:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    class:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    fatherName:{
        type:String,
        required:true
    },
    cnic:{
        type:String,
        required:true
    },
    
})

const Studentmodel = mongoose.model('Students' , studentSchema)

router.post("/create-student", async (req, res) => {
    const {newPassword , name,  newEmail , newInstitudeName , newInstitudeAddress ,newInstitudeDescription ,newPhoneNumber  } = req.body;
  
    console.log(`data:{
      ${newPassword} ,
    
      ${newEmail} ,
      ${newInstitudeAddress}
      ${newInstitudeDescription}
      ${newInstitudeName}
      ${newPhoneNumber}
    }`);
  
    if (!newPassword || !newEmail || !newPhoneNumber || !newInstitudeAddress || !newInstitudeName || !newInstitudeDescription || !newFullName) {
      res.status(400).send(
        `required fields missing, request example: 
        {
          "firstName": "John",
          "lastName": "Doe",
          "email": "abc@abc.com",
          "password": "12345"
        }`
      );
      return;
    }
  
    try {
      const user = await Usermodel.findOne({ email: newEmail});
  
      if (user) {
        // User with provided email or username found
        console.log("user already exists: ", user);
        res.status(400).send( "User already exists. Please try a different email or username." );
        return;
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
  
        // console.log("Hashed Password:", hashedPassword);
  
        const data = await Usermodel.create({
            InstitudeName: newInstitudeName,
          InstitudeAddress: newInstitudeAddress,
          InstitudeDescreption: newInstitudeDescription,
          phoneNumber:newPhoneNumber,
          name: newFullName,
          email: newEmail,
          password: hashedPassword,
        });
  
        console.log(data);
        res.redirect("/")

        const token = jwt.sign({
          _id: data._id,
          email: data.email,
          iat: Date.now() / 1000 - 30,
          exp: Date.now() / 1000 + (60 * 60 * 24),
        }, SECRET);
        console.log('token', token);
  
        res.cookie('token', token, {
          maxAge: 86_400_000,
          httpOnly: true,
        });
        
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ error: "Failed to register user." });
    }
  });