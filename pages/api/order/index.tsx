import { PrismaClient } from "@prisma/client";
import { NextApiRequest,NextApiResponse } from "next";
const prisma = new PrismaClient();
export default async function order(req:NextApiRequest,res:NextApiResponse){
        if(req.method==='POST'){
            try{
                const{iduser,customer,phone,address} = req.body;
                console.log(iduser);
                console.log(req.body);
                const searchUser = await prisma.user.findUnique({
                    where:{id:Number(iduser)}
                })
                const data = await prisma.cart.findMany({
                    where:{iduser:Number(iduser)},
                    include:{product:true}
                })
                if(!data){
                    return res.status(400).json("Bạn chưa có sản phẩm nào trong giỏ hàng!")
                }
                const items = data.map(item=>{
                    return {productId:item.idproduct, quantity:item.quantity,price:item.product.price}
                })
                if(!searchUser){
                    return res.status(400).json("Người dùng không tồn tại")
                }
                const idproducts = items.map((item:any)=>item.productId);
                const exitingProducts = await prisma.product.findMany({
                    where:{
                        id:{in:idproducts}
                    },
                    select:{
                        id:true
                    }
                });
                const existingProductIds = new Set<number>(exitingProducts.map(p => p.id));
                const missingProducts = items.filter((item:any) => !existingProductIds.has(item.productId));
                
                if (missingProducts.length > 0) {
                    return res.status(400).json({
                      message: "Có sản phẩm không tồn tại!",
                      missingProducts: missingProducts.map((item:any) => item.productId), // Danh sách ID không tồn tại
                    });
                  }

                const totalPrice = items.reduce((sum:any,item:any)=>sum+item.price*item.quantity,0)
                const newOrder = await prisma.order.create({
                    data:{
                        iduser:Number(iduser),
                        customer,
                        phone,
                        address,
                        items:{
                            create:items.map((item:any)=>({
                                productId:item.productId,
                                quantity:item.quantity,
                                price:item.price,
                            })),
                        },
                        totalPrice
                    },
                    include:{items:true}
                })
                if(newOrder){
                await prisma.cart.deleteMany({where:{iduser:Number(iduser)}})
                 return   res.status(200).json("Đặt hàng thành công!")
                }
                if(!newOrder){
                    res.status(400).json("lỗi")
                }
            }catch(err){
                res.status(500).json("Lỗi hệ thống server!"+err);
            }
        }else if(req.method==="GET"){
                try{
                    const {id}=req.query;
                    if(id){
                        const checkUser = await prisma.user.findUnique({where:{id:Number(id)}})
                        if(!checkUser){
                            return res.status(400).json("Người dùng không tồn tại!")
                        }
                        const searchId= await prisma.order.findMany({
                            where:{iduser:Number(id)}
                        });
                        if(!searchId){
                            return res.status(500).json("Lỗi hệ thống");
                        }
                        if(searchId.length<1){
                            return res.status(200).json("Bạn chưa có đơn hàng nào!")
                        }
                        return res.status(200).json(searchId)
                    }else{
                        const findManyId = await prisma.order.findMany({})
                        if(!findManyId){
                            return res.status(500).json("Lỗi hệ thống!")
                        }
                        if(findManyId.length<1){
                            return res.status(200).json("Hệ thống chưa có đơn hàng!")
                        }
                        return res.status(200).json(findManyId)
                    } 
                }catch(err){
                    res.status(400).json("Lỗi server!")
                }
        }
}