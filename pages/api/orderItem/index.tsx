import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function OrderItem(req:NextApiRequest,res:NextApiResponse){
       try{ 
        const {id}=req.query
    

        const findOrder = await prisma.order.findFirst({where:{id:Number(id)}});
        if(!findOrder){
            return res.status(400).json("Đơn hàng không tồn tại!")
        }
        const OderItem = await prisma.orderItem.findMany({
            where:{orderId:Number(id)},
            include:{product:true}
        })
        if(OderItem){
            return res.status(200).json(OderItem)
        }
    }catch(err){
        res.status(500).json("Lỗi server"+err)
    }
}