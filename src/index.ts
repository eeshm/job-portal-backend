import express from "express";
import mongoose from "mongoose";
import z from "zod"
import cors from 'cors';
import { JobModel } from "./db";
import dotenv from "dotenv"

dotenv.config();



const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST','PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


const app = express();

app.use(cors(corsOptions));  // Apply CORS to all routes
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.post("/",async function (req,res):Promise<void>{
    const requiredFields = z.object({
        title :z.string(),
        description:z.string(),
        type :z.string(),
        company :z.string(),
        location :z.string(),
        minSalary:z.number(),
        maxSalary:z.number(),
        deadline:z.string()
    })

    const parsedData = requiredFields.safeParse(req.body);
    if(!parsedData.success){
        res.status(411).json({
            message:"Provide all values",
            error: parsedData.error.errors
        })
        return 
    }
    const {title,description,type,company,location,minSalary,maxSalary,deadline}=req.body;
    try{
        const newJob = new JobModel({
            title,
            description,
            type,
            company,
            location,
            minSalary,
            maxSalary,
            deadline
        })

        await newJob.save();
        res.status(201).json({
            message:"User created successfully",
            data:{
                newJob:newJob
            }
        })
    }catch(err){
        const errorMessage = err instanceof Error ? err.message : "Unknown database error";
        res.status(500).json({
            message:"Internal server error",
            error:errorMessage
        })
    }
})


app.get("/",async function(req,res){
    try{
        const jobs = await JobModel.find();
        res.status(200).json({
            message:"Fetched successfully",
            jobs:jobs
        })
    }catch(err){
        res.status(500).json({
            error:"Failed to fetch jobs",
            details:err
        })
    }
})


app.listen(5000,async function(){
    console.log("Server started on port 5000")
    const mongoUrl = process.env.BACKEND_URL || "";
    if(!mongoUrl){
        console.log("MongoDB URL not found")
        return
    }
    try{
        await mongoose.connect(mongoUrl);
        console.log("MongoDB connected successfully")
    }catch(err){
        console.log("Failed to connect to MongoDB",err)
    }
})