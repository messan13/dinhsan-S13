import { PrismaClient } from "@prisma/client";
const prisma =  new PrismaClient();
import { NextApiRequest , NextApiResponse } from "next";
export default async function index(req:NextApiRequest , res:NextApiResponse){
    if(req.method === 'POST'){
        const {iduser , idproduct} = req.body
            const tkuser = await prisma.user.findUnique({
                where:{id:Number(iduser)}
            })
            if(!tkuser){
                return res.status(400).json("người dùng không tồn tại!")
            }
        const tkproduct  = await prisma.product.findUnique({
            where:{id:Number(idproduct)}
        })  
        if(!tkproduct){
            return res.status(400).json("sản phẩm ko tồn tại!")
        }

        const checkcarts = await prisma.cart.findMany({
            where:{iduser:Number(iduser)}
        })
        for(let i=0;i<checkcarts.length;i++){
            if(checkcarts[i].idproduct===Number(idproduct)){
                return res.status(400).json("Sản Phẩm  đã có trong giỏ hàng!")
                break;
            }
        }

        try{
         const create = await prisma.cart.create({
                 data: {
                    iduser:Number(iduser),
                    idproduct:Number(idproduct)
                 }
               });
               if(create){
                res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng của bạn !")
               }
            } catch(err){
                res.status(500).json("lỗi server " + err)
            }
    }
}