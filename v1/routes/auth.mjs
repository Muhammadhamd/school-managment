
import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const __dirname = path.resolve();
const SECRET = process.env.SECRET || "topsecret";

const userSchema = new mongoose.Schema({
    InstitudeName:{
        type:String,
        required: true,
        // unique:true
    },
    InstitudeDescreption:{
        type:String,
        required:true
    },
    InstitudeAddress:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    }
})

const Usermodel = mongoose.model('Users' , userSchema)

router.post("/register", async (req, res) => {
    const {newPassword , newFullName,  newEmail , newInstitudeName , newInstitudeAddress ,newInstitudeDescription ,newPhoneNumber  } = req.body;
  
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

 
router.post("/login", async (req, res) => {
  const { userAddress, userPassword } = req.body;

  try {
    const data = await Usermodel.findOne(
      {  email: userAddress  },
      "InstitudeName name email password"
    );
0
    if (!data) {
      console.log("User not found");
      return res.status(401).send( "Incorrect email or password" );
    }

    const isMatch = await bcrypt.compare(userPassword, data.password);

    if (isMatch) {
      console.log("Password matches");

      const token = jwt.sign({
        _id: data._id,
        email: data.email,
        iat: Date.now() / 1000 - 30,
        exp: Date.now() / 1000 + (60 * 60 * 24),
      }, SECRET);
      console.log('login token', token);

      res.cookie('token', token, {
        maxAge: 86_400_000,
        httpOnly: true,
      });

      res.redirect("/")
    } else {
      console.log("Password did not match");
      return res.status(401).send({ message: "Incorrect password" });
    }
  } catch (err) {
    console.log("DB error:", err);
    res.status(500).send({ message: "Login failed, please try later" });
  }
});

router.post("/logout", (req, res) => {

  res.cookie('token', '', {
      maxAge: 1,
      httpOnly: true
  });
  res.redirect('/registration')

  res.send({ message: "Logout successful" });
})
  

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (token) {
//     // Token  found, redirect to home page or show a message that they need to log in
//     return res.redirect("/");
//   }

// };

router.get("/registration", (req ,res ,next)=>{
    
        if(req.cookies.token){
            res.redirect("/")
            return;
        }
    res.sendFile(path.join(__dirname , "public/auth.html"))

    
})




export default router