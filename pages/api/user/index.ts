import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import{ NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async function CreateUser(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='POST'){
        const {name,email,password,admin}=req.body  
        const hanlpassword = await bcrypt.hash(password, 10);
      try{
            const newUser= await prisma.user.create({
                data:{
                    name,
                    email,
                    password:hanlpassword,
                    checkAdmin:admin
                },
            })         
           res.status(200).json(newUser)
      }catch(err){
      res.status(500).json({error:"Eroor creating user"})
      }
    }else if(req.method==='GET'){
        try{
           const user = await prisma.user.findMany()
          res.status(200).json(user)
        }catch(error){
           res.status(500).json({error:'error fetching lấy user!'})
        }
       }
    
    else{
     res.status(400).json({ error:'Methord không đúng'});
    }
}