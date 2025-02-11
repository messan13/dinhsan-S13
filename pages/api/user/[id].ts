import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export default async function UpdateUser(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'PUT') {
        const { id } = req.query; 

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const { name, email} = req.body;
      
            

        try {
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    name,
                    email,
                },
            });
            if(updatedUser){
            res.status(200).json("cập nhật thành công"); 
            }else{
                res.status(400).json("cập nhập thất bại")
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error updating user" });
        }
    } else   if (req.method === 'DELETE') {
      
        const { id } = req.query; 

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        try {
            const deletedUser = await prisma.user.delete({
                where: { id: Number(id) },
              });;
            if(deletedUser){
            res.status(200).json("xáo thành công"); 
            }else{
                res.status(400).json("xóa thất bại")
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error updating user" });
        }
    } else if(req.method==='GET'){
        const {id} = req.query
        try{
            const user = await prisma.user.findUnique({
                where: {
                  id: Number(id),
                },
              });
              if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
        
              return res.status(200).json(user);
        }catch(err){
            res.status(500).json("lỗi server")
        }
    }
    
    else {
        res.status(405).json({ error: `Method not allowed` });
    }
}
