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
                where :{id : Number(exitingCartItem.id)} ,
                data:{quantity :exitingCartItem.quantity+Number(quantity)}
            });
            if(update){
              return  res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng của bạn !")
            }
        }catch(err){
            console.log(err);
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
                 return  res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng của bạn !")
                  }
               } catch(err){
                   res.status(500).json("lỗi server " + err)
               }
     }
    } else if(req.method==='DELETE'){
        const {id} = req.query
        try{
            const dele = await prisma.cart.deleteMany({
                where:{idproduct:Number(id)}
            })
            if(dele){
              return  res.status(200).json("sản phẩm đã được xóa")
            }
        }catch(err){
            res.status(500).json("Lỗi server "+err)
        }
    }else if(req.method==='GET'){
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
                      return  res.status(200).json(data)
                    }
                }catch(err){
                    res.status(500).json("lỗi server " + err)
                }
            }
}