import jwt from 'jsonwebtoken'
import { userModel } from "../Models/userModel.js"

export const adduser = async (req,res)=>{
    try{
        console.log("ok good");
        

        const user= await userModel.create(req.body)
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
            );

            res.status(201).send({
            message: "signin successfully",
            token,
            data: user
            });
            console.log("token:",token);
            
        
    }catch(error){
        console.log("errroorr",error);
        res.status(500).send("signup failed")
    }
}

export const loginuser = async (req,res)=>{
    try{
        const{email}=req.body
        const loginuser= await userModel.findOne({email})
        console.log(loginuser);


        if (!loginuser) {
            return res.status(404).send("user not found !!!")
        }
        console.log(loginuser._id);
        

        const token = jwt.sign(
        { id: loginuser._id, email: loginuser.email },
         process.env.JWT_SECRET,
        { expiresIn: "1d" }
        )
        console.log("user unddoooo",loginuser._id);
        
        console.log(token);
        

        res.status(200).json({
        message: "Successfully login",
        token: token,  
        user: loginuser
        });
        
    }catch(error){
        console.log("error",error);
        res.status(500).send("login failed")
    }
}