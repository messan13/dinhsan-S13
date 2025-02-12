import { PrismaClient } from "@prisma/client";
const prisma =  new PrismaClient();
import { NextApiRequest , NextApiResponse } from "next";
export default async function index(req:NextApiRequest , res:NextApiResponse){
    if(req.method === 'POST'){
        const {iduser , idproduct,quantity} = req.body
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

        const exitingCartItem = await prisma.cart.findFirst({
            where:{
                iduser:Number(iduser),
                idproduct:Number(idproduct)
            }
        })
        if(exitingCartItem){
            try{
           const update= await prisma.cart.update({
                where :{id : exitingCartItem.id} ,
                data:{quantity :exitingCartItem.quantity+quantity}
            });
            if(update){
                res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng của bạn !")
            }
        }catch(err){
            res.status(500).json("lỗi server " + err);
        }
        }

     else{
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
}