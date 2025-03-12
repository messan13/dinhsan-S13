import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
const prisma = new PrismaClient();
export default async function(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='GET'){
        try {
            const category = await prisma.category.findMany({})
            if(category){
                res.status(200).json(category)
            }
        }catch (error) {
            res.status(500).json("Lỗi server khi xem danh mục")
        }
        } else if(req.method==='POST'){
            const {name,type}=req.body
                if(!name || !type){
                    return res.status(400).json("bạn không được bỏ trống mục!")
                }
                const slug = slugify(name,{lower:true,strict:true})
            try {
               const post = await prisma.category.create({
                data:{name,slug,type}
               })
               if(post){
                res.status(200).json("Bạn vừa tạo một danh mục")
               }
            } catch (error) {
                res.status(500).json("Lỗi server khi thêm danh mục")
            }
        }else{
            res.status(400).json("Methord không hợp lệ")
        }
    
}
