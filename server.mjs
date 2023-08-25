import express from "express"
const app = express()
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import v2router from './v2/index.mjs'
import v1router from './v1/index.mjs'
const __dirname = path.resolve()
const mongodbURI =  process.env.mongodbURI || "mongodb+srv://muhammadhamdali572:hamdali99332@cluster0.g7j5dka.mongodb.net/institudemanagment?retryWrites=true&w=majority";


app.use(express.json())
app.use(cookieParser())
app.use(v1router)
app.use(express.static(__dirname))
app.use("/v2",v2router)



const PORT = process.env.PORT || 300

app.listen(PORT,()=>{
    console.log(PORT)
})

mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function (e) {//disconnected
    console.log("Mongoose is disconnected",e);
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});