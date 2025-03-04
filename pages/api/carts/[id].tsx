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
        }  else if(req.method==='PUT'){
            const {id} = req.query 
            const {quantity} = req.body
            if(quantity <=0){
                await prisma.cart.delete({where:{id:Number(id)}})
                return res.status(200).json("Sản phẩm đã được xóa khỏi giỏ hàng")
            }
            const update = await prisma.cart.update({
                where:{id:Number(id)},
                data:{quantity:Number(quantity)}
            })
            if(update){
               return res.status(200).json("cập nhật số lượng thành công")
            }
        }
}