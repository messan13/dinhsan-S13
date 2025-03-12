import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function idproductCategory(req:NextApiRequest,res:NextApiResponse){
 if(req.method==='DELETE'){
    const { productId, categoryId } = req.body;
    if (!productId || !categoryId) {
        return res.status(400).json('Bạn không được để trống mục khi xóa');
      }
    try {
      const dele=  await prisma.productCategory.delete({
            where: {
              productId_categoryId: {
                productId: Number(productId),
                categoryId: Number(categoryId),
              },
            },
          });
          if(dele){
            return res.status(200).json('Sản Phẩm đã được xóa khỏi danh mục')
          }
    } catch (error) {
        return res.status(500).json("Lỗi server khi xóa sản phẩm khỏi danh mục")
    }
 } else if(req.method==='GET'){
  const { id} = req.query;
  if(!id){
    return res.status(400).json("bạn không được để trống mục!")
  }
  try {
    const get = await prisma.product.findMany({
      where:{
        categories:{
          some:{categoryId:Number(id)}
        }
      },
      include:{
        categories:true
      }
    })
    res.status(200).json(get)
  } catch (error) {
    
  }
 }
}