import { NextApiRequest , NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import product from "../product/[id]";
const prisma = new PrismaClient();
export default async function dele(req:NextApiRequest , res:NextApiResponse){
        if(req.method==='DELETE'){
            const {id} = req.query
            try{
                const dele = await prisma.cart.delete({
                    where:{id:Number(id)}
                })
                if(dele){
                    res.status(200).json("Sản Phẩm đã được xóa khỏi giỏ hàng!")
                }
            }catch(err){
                res.status(500).json("lỗi server " +err)
            }
        }  else if(req.method==='GET'){
            try{
                const {id} = req.query
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({ error: 'Invalid user ID' });
                  }
                const data = await prisma.cart.findMany({
                    where:{iduser:Number(id)},
                    include:{product:true}
                })
       
                if(data){
                    res.status(200).json(data)
                }
            }catch(err){
                res.status(500).json("lỗi server " + err)
            }
        }
}