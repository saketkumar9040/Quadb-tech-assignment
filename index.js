import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./configs/dbConfig.js";
import router from "./routes/userRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

app.use("/",router)

app.listen(process.env.PORT,()=>{
    console.log(`server listening to ${process.env.PORT}`)
});


