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
       }else if(req.method==='PUT'){
        try{
        const {id}=req.query
        const {pass,newpass}=req.body
        if(!id || !pass || !newpass){
            return res.status(400).json("bạn chưa nhập đủ trường!")
        }
        const checkid = await prisma.user.findFirst({where:{id:Number(id)}})
        if(!checkid){
            return res.status(400).json("người dùng không tồn tại!")
        }
        const isMatch = await bcrypt.compare(pass, checkid.password);
        if(!isMatch){
            return res.status(400).json("Mật khẩu bạn cũ của bạn không đúng ! Hãy cung cấp đúng để cập nhật mật khẩu mới!")
        }
        const hanlpassword = await bcrypt.hash(newpass, 10);
        const uppass = await prisma.user.update({
            where:{id:Number(id)},
            data:{password:hanlpassword}
        })
        if(uppass){
            return res.status(200).json("Cập nhập mật khẩu thành công!")
        }
    }catch(err){
        res.status(500).json("lỗi server"+err)
    }

       }
    
    else{
     res.status(400).json({ error:'Methord không đúng'});
    }
}