import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function updateOrder(req:NextApiRequest,res:NextApiResponse){
    const {id} = req.query
    const {status} = req.body
    if(!status){
        return res.status(400).json("Bạn chưa cập nhật dữ liệu sửa")
    }
    try{
        const checkIdOrder = await prisma.order.findFirst({where:{id:Number(id)}})
        if(!checkIdOrder){
            return res.status(400).json("Đơn hàng không tồn tại!")
        }
        const updateOrder = await prisma.order.update({
            where:{id:Number(id)} ,
            data:{status:status}
    })
    if(updateOrder){
        return res.status(200).json("Update dữ liệu thành công")
    }
    }catch(err){
        res.status(500).json('lỗi server!')
    }
}